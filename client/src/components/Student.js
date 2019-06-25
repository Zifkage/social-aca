import React, { Component } from 'react';
import Home from './home';
import Login from './login';
import Register from './register';
import Profile from './profile';
import WorkshopPage from './workshopPage';
import PostDetail from './postDetail';
import WorkshopDetail from './workshopDetail';
import Notification from './notification';
import { withRouter } from 'react-router-dom';
import Top from './top';
import Navbar from './navbar';
import { Route } from 'react-router-dom';

export default class Student extends Component {
  render() {
    const LoginHoc = withRouter(Login);
    const { match } = this.props;
    return (
      <div>
        <Navbar />
        <div style={{ marginTop: '70px' }} className="container">
          <Route exact path={`${match.url}`} component={Home} />
          <Route
            path={`${match.url}/login`}
            render={() => <LoginHoc redirectTo={`${match.url}`} />}
          />
          <Route path={`${match.url}/register`} component={Register} />
          <Route path={`${match.url}/notifications`} component={Notification} />
          <Route
            path={`${match.url}/viewer/profile/:userId`}
            component={Profile}
          />
          <Route path={`${match.url}/profile/:userId`} component={Profile} />
          <Route
            exact
            path={`${match.url}/workshop`}
            component={WorkshopPage}
          />
          <Route path={`${match.url}/post/:postId`} component={PostDetail} />
          <Route
            path={`${match.url}/workshop/:workshopId`}
            component={WorkshopDetail}
          />
          <Route path={`${match.url}/top`} component={Top} />
        </div>
      </div>
    );
  }
}
