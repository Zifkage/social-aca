import React, { Component } from 'react';
import Navbar from './components/navbar';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="container">hello</div>
      </div>
    );
  }
}

export default App;
