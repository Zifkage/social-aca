import React, { Component } from 'react';
import * as ClientAPI from '../ClientAPI';
import Workshop from './workshop';

export default class MyTd extends Component {
  state = {
    isLoading: true,
    workshops: []
  };

  componentDidMount() {
    ClientAPI.mytd().then(res => {
      this.setState({
        isLoading: false,
        workshops: res.data
      });
    });
  }

  render() {
    if (this.state.workshops.length === 0) {
      return <span>(Vous n'avez créé aucun TD)</span>;
    }
    return (
      !this.state.isLoading && (
        <div>
          {this.state.workshops.map(w => {
            return <Workshop navigable loc='list' key={w._id} workshop={w} />;
          })}
        </div>
      )
    );
  }
}
