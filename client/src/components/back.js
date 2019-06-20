import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class back extends Component {
  goBack() {
    this.props.history.goBack();
  }
  render() {
    return (
      <button
        onClick={this.goBack.bind(this)}
        type='button'
        class='btn btn-dark'
      >
        <i style={{ fontSize: '20px' }} className='fas fa-angle-left' /> Retour
      </button>
    );
  }
}

export default withRouter(back);
