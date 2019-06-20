import React, { Component } from 'react';
import * as ClientAPI from '../ClientAPI';

import Workshop from './workshop';
import BackButton from './back';

export default class workshopDetail extends Component {
  state = {
    isLoading: true,
    workshop: ''
  };

  componentDidMount() {
    const {
      match: {
        params: { workshopId }
      }
    } = this.props;
    ClientAPI.getWorkshop(workshopId).then(res => {
      this.setState({ isLoading: false, workshop: res.data });
    });
  }

  render() {
    return (
      <div>
        <BackButton />

        {this.state.isLoading ? (
          <div>Loading...</div>
        ) : (
          <Workshop workshop={this.state.workshop} />
        )}
      </div>
    );
  }
}
