import React, { Component } from 'react';
import './App.css';
import Navbar from './components/navbar';
import { Route } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';
import Register from './components/register';
import Profile from './components/profile';
import WorkshopPage from './components/workshopPage';
import PostDetail from './components/postDetail';
import WorkshopDetail from './components/workshopDetail';
import Notification from './components/notification';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div style={{ marginTop: '70px' }} className='container'>
          <Route exact path='/' component={Home} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/notifications' component={Notification} />
          <Route path='/viewer/profile/:userId' component={Profile} />
          <Route path='/profile/:userId' component={Profile} />
          <Route exact path='/workshop' component={WorkshopPage} />
          <Route path='/post/:postId' component={PostDetail} />
          <Route path='/workshop/:workshopId' component={WorkshopDetail} />
        </div>
      </div>
    );
  }
}

export default App;
