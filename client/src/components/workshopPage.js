import React, { Component } from 'react';
import * as ClientAPI from '../ClientAPI';

import Workshop from './workshop';
import BackButton from './back';

export default class workshopPage extends Component {
  state = {
    isLoading: true,
    workshops: []
  };

  componentDidMount() {
    ClientAPI.getWorshopsList().then(res => {
      this.setState({
        isLoading: false,
        workshops: res.data
      });
    });
  }

  render() {
    return (
      !this.state.isLoading && (
        <div>
          <h3 className='mb'>Travaux Dirigés</h3>
          {this.state.workshops.map(w => {
            return <Workshop navigable loc='list' key={w._id} workshop={w} />;
          })}
        </div>
      )
    );
  }
}
