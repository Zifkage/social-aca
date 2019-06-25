import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';

import Admin from './components/Admin';
import Student from './components/Student';

class App extends Component {
  render() {
    return (
      <div>
        <Route path="/student" component={Student} />
        <Route path="/admin" component={Admin} />
      </div>
    );
  }
}

export default App;
