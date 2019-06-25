import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import Login from './login';
import Nav from './Nav';
import Dashboard from './Dashboard';

export default class Admin extends Component {
  render() {
    const LoginHoc = withRouter(Login);
    const { match } = this.props;

    return (
      <div>
        <Nav />
        <div style={{ marginTop: '70px' }} className="container">
          <Route
            exact
            path={`${match.url}`}
            render={() => <LoginHoc redirectTo={`${match.url}/dashboard`} />}
          />
          <Route path={`${match.url}/dashboard`} component={Dashboard} />
        </div>
      </div>
    );
  }
}
