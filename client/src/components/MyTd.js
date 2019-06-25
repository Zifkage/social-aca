import React, { Component } from 'react';
import * as ClientAPI from '../ClientAPI';
import Workshop from './workshop';

export default class MyTd extends Component {
  state = {
    isLoading: true,
    workshops: [],
  };

  componentDidMount() {
    ClientAPI.mytd().then((res) => {
      this.setState({
        isLoading: false,
        workshops: res.data,
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
          <form onSubmit={this.onSearch} className="navbar-form" role="search">
            <div className="input-group add-on">
              <input
                className="form-control"
                placeholder="Recherche"
                name="srch-term"
                id="srch-term"
                type="text"
                value={this.state.search}
                onChange={this.onChange}
              />
              <div className="input-group-btn">
                <button className="btn btn-default" type="submit">
                  <i className="fa fa-search" />
                </button>
              </div>
            </div>
          </form>
          {this.state.workshops.map((w) => {
            return <Workshop navigable loc="list" key={w._id} workshop={w} />;
          })}
        </div>
      )
    );
  }
}
