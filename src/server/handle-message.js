function extractPledge(messageText) {
  const pledgeRe = /^\s*\$?(\d+(?:\.\d\d)?)\s+(.*)/;
  const match = messageText.match(pledgeRe);
  if (match) {
    return {
      amount: match[1],
      note: match[2]
    };
  }
  return false;
}


  
/*
data to store for each phone number:
- pledges so far

valid states for message parser:
- listening for pledge or command (default state)

actions that can be taken:
- update state
- store something in a db
- send an sms

*** do some concurrency thing in the server to queue requests per incoming phone number

whole main loop looks like this:

on incoming sms, do the following:
- write message to database andThen
- call handleMessage to do state update logic or whatever andThen
- execute all other pending actions andThen
- write new state to database with pointer to last seen message
then release the lock


send sms function should both log to database and send




ok actual action time

state: LISTENING
message: valid pledge message
actions:
  - write pledge to db
  - send thank you message
new state: LISTENING

state: LISTENING
message: invalid pledge message
actions:
  - send help message
new state: LISTENING

*/

const initialState = ({
  stateName: 'LISTENING',
  lastMessageId: null
});

function nextState(state = initialState, message) {
  switch (state.stateName) {
    case 'LISTENING':
      const pledge = extractPledge(message.Body);
      let actions;
      if (pledge) {
        actions = [
          {
            type: 'SEND_SMS',
            from: message.To,
            to: message.From,
            body: "Thank you for your pledge of $" + pledge.amount
                + "! We'll contact you after the event to collect your pledge."
          },
          {
            type: 'WRITE_PLEDGE',
            amount: pledge.amount,
            note: pledge.note
          }
        ]
      } else {
        actions = [{
          type: 'SEND_SMS',
          from: message.To,
          to: message.From,
          body: "Please text your pledge amount and an optional message to display on the screen."
        }]
      }
      return {
        state: {...state, lastMessageId: message.MessageSid},
        actions
      }
    default:
      return {state, actions: []};
  }
}

function sendSMS({to, from, body}, ctx) {
  ctx.twilioClient.sms.messages.post({to, from, body}).then(response => {
    const messageId = response.sid;
    return ctx.outgoingMessageStore.child(messageId).set(response);
  })
}

function recordPledge({amount, note}, ctx) {
  return ctx.pledgeStore.push({
    amount,
    note,
    user: ctx.user
  });
}

function dispatchAction(action, ctx) {
  switch (action.type) {
    case 'SEND_SMS':
      return sendSMS(action, ctx);
    case 'WRITE_PLEDGE':
      return recordPledge(action, ctx)
    default:
      return Promise.resolve();
  }
}

function getCurrentState(ctx) {
  return ctx.stateStore.child(ctx.user).once('value').then((snapshot) => {
    const dbState = snapshot.val();
    if (dbState === null) {
      return initialState;
    }
    return dbState;
  });
}

function isValid(message) {
  if (!Object.hasOwnProperty.call(message, 'From')) {return false};
  if (!Object.hasOwnProperty.call(message, 'To')) {return false};  
  if (!Object.hasOwnProperty.call(message, 'Body')) {return false};  
  if (!Object.hasOwnProperty.call(message, 'MessageSid')) {return false};  
  return true;
}

function handleMessage(message, ctx) {
  if (!isValid(message)) {
    return Promise.reject();
  }
  const messageId = message.MessageSid;
  return Promise.all([
    getCurrentState(ctx),
    ctx.incomingMessageStore.child(messageId).set(message)
  ]).then(([currentState, _]) => {
    const {state, actions} = nextState(currentState, message);
    return Promise.all([state, ...actions.map(a => dispatchAction(a, ctx))]);
  }).then(([state, ...actionResults]) => {
    return ctx.stateStore.child(ctx.user).update(state);
  })
}

export default handleMessage;