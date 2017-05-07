import preact from 'preact';
import Router from 'preact-router';
import Home from './screens/home-screen';
import Admin from './screens/admin-screen';

import {
  HOME_ROUTE,
  ADMIN_ROUTE
} from './routes';

const App = ({location, initialState}) => {
  return <Router url={location}>
    <Home path={HOME_ROUTE} theme="dark" />
    <Admin path={ADMIN_ROUTE} />
  </Router>
};

export default App;