import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import LoginPage from "./LoginPage";
import MapsPage from "./MapsPage";
import AboutPage from "./AboutPage";

import {
  changeUser
} from "../reducers";
import { connect } from 'react-redux';

class Template extends React.Component {

  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);
  }

  logoutUser(ev) {
    localStorage.removeItem('userLogged');
    this.props.changeUser(undefined);
  }

  render() {
    const username = this.props.user;
    console.log(this.props);
    return (
      <Router>
        <nav>
          <ul className='left'>
            <li>
              <Link to="/">Map</Link>
            </li>
            <li>
              {username == undefined ? <Link to="/login">Login</Link> : <a onClick={this.logoutUser} href="#">Logout</a>}
            </li>
            <li>
              <Link to="/about">About author</Link>
            </li>
          </ul>
          {username && <span className='right welcoming_username'>Welcome, {username}</span>}
        </nav>

        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/">
            <MapsPage />
          </Route>
        </Switch>
      </Router>
    )
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
    return {
        changeUser: user => dispatch(changeUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Template);