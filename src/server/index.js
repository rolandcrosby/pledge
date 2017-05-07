import express from 'express';
import bodyParser from 'body-parser';

import firebase from 'firebase-admin';
import twilio from 'twilio';
import AsyncLock from 'async-lock';

import handleMessage from './handle-message';


// frontend stuff to rearrange
import renderApp from './render-app';
import { STATIC_PATH } from '../shared/config';

import {
  HOME_ROUTE,
  ADMIN_ROUTE
} from '../shared/routes';

import {
  homePage,
  adminPage
} from './controller';


const app = express();
app.use(STATIC_PATH, express.static('public'));
app.use(STATIC_PATH, express.static('dist'));

app.get(HOME_ROUTE, function(request, response) {
  response.send(renderApp(request.url, homePage()));
});

app.get(ADMIN_ROUTE, function(request, response) {
  response.send(renderApp(request.url, adminPage()));
});



if (process.env.FIREBASE_KEY_BASE64 && process.env.FIREBASE_DB_URL
    && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  const firebaseCreds = JSON.parse(new Buffer(process.env.FIREBASE_KEY_BASE64, 'base64').toString('utf8'));
  firebase.initializeApp({
    credential: firebase.credential.cert(firebaseCreds),
    databaseURL: process.env.FIREBASE_DB_URL
  });
  const db = firebase.database();
  const incomingMessageStore = db.ref('messages/incoming');
  const outgoingMessageStore = db.ref('messages/outgoing');
  const stateStore = db.ref('state');
  const pledgeStore = db.ref('pledges');
  const stateLock = new AsyncLock();

  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  const parser = bodyParser.urlencoded({extended: false});
  app.post('/message/' + process.env.TWILIO_SMS_ENDPOINT, parser, function(req, res) {
    res.end();
    if (!Object.hasOwnProperty.call(req.body, 'From')) {
      return;
    }
    stateLock.acquire(req.body.From, () => {
      return handleMessage(req.body, {
        user: req.body.From,
        incomingMessageStore,
        outgoingMessageStore,
        stateStore,
        pledgeStore,
        twilioClient
      });    
    });
  });
}

var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
