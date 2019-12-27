import React from 'react';

import { users } from "../data.json";
import "./LoginPage.less";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeUser } from '../reducers';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }
  onChange(ev) {
    const {id} = ev.target;
    this.setState({
      [id]: ev.target.value
    }) 
  }
  submitForm(ev) {
    ev.preventDefault();

    const { username, password } = this.state;
    const { history } = this.props;
    users.map((user) => {
      if(user.name == username && user.password == password) {
        localStorage.setItem('userLogged', username);
        this.props.changeUser(username);
        history.push('/');
      }
    })
  }
  render() {
    return (
      <div>
        <h4 id='login_welcome_msg'>Login to React Maps application</h4>
        
        <form onSubmit={this.submitForm}>
          <div className="input-field">
            <input value={this.state.username} onChange={this.onChange} type='text' className='validate' id='username'/>
            <label htmlFor='username'>Username</label>
          </div>
          <div className="input-field">
            <input value={this.state.password} onChange={this.onChange} type='password' className='validate' id='password' placeholder='password' />
            <label htmlFor='password'>Password</label>
          </div>
          <input className='btn' type='submit' value='Login' />
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
    return {
        changeUser: user => dispatch(changeUser(user))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage));