import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import LandingPage from './component/views/LandingPage/LandingPage';
import LoginPage from './component/views/LoginPage/LoginPage';
import RegisterPage from './component/views/RegisterPage/RegisterPage';
import Auth from './hoc/auth';


function App() {
  return (
    <Router>
    <div>
      {/*
        A <Switch> looks through all its children <Route>
        elements and renders the first one whose path
        matches the current URL. Use a <Switch> any time
        you have multiple routes, but you want only one
        of them to render at a time
      */}
      <Switch>
        <Route exact path="/" component ={Auth(LandingPage, null)}></Route>
        <Route exact path="/login"  component ={Auth(LoginPage, false)}></Route>
        <Route exact path="/register"  component = {Auth(RegisterPage, false)}></Route>
      </Switch>
    </div>
  </Router>
  );
}

export default App;
