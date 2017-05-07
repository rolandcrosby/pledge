import preact from 'preact';
import Helmet from 'preact-helmet';

function PledgeList({pledges}) {
  return (
    <ul>
    {
      pledges.map((pledge) => <PledgeListItem key={pledge.id} pledge={pledge} />)
    }
  </ul>);
}

function PledgeListItem({pledge}) {
  return (
    <li>
      <span>{'$' + pledge.amount}</span>
      <span>{pledge.message}</span>
      <button>approve</button>
    </li>
  );
}

class AdminScreen extends preact.Component {
  constructor() {
    super();
    this.state.pledges = [
      {id: 1, approved: false, amount: 49, message: "Thank you for all your work"},
      {id: 2, approved: false, amount: 66, message: "yeah boiiiii"},
      {id: 3, approved: false, amount: 5, message: "it me"},
      {id: 4, approved: false, amount: 25.03, message: "this one has a long message lalalala gotta figure out how to display this"},
    ]
  }
  componentWillMount() {
    console.log("admin screen got componentWillMount");
  }
  
  render() {
    return <div>
      <Helmet title='Admin' />
      <h1>Admin</h1>
      <PledgeList pledges={this.state.pledges} />
    </div>;
  }
}

export default AdminScreen;