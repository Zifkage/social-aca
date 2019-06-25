import React, { Component } from 'react';
import * as ClientAPI from '../ClientAPI';
import Workshop from './workshop';

export default class Td extends Component {
  state = {
    workshops: [],
    search: '',
    isloading: false,
    onResult: '',
  };

  componentDidMount() {
    ClientAPI.td().then((res) => {
      this.setState({
        workshops: res.data,
      });
    });
  }

  onSearch = (e) => {
    e.preventDefault();
    if (!this.state.search) return;
    ClientAPI.td(this.state.search).then((res) => {
      this.setState({ workshops: res.data, onResult: this.state.search });
    });
  };

  onDelete = async (id) => {
    let newWorkshops = [...this.state.workshops];
    newWorkshops = newWorkshops.filter((w) => w._id !== id);
    await ClientAPI.deltd(id);
    this.setState({ workshops: newWorkshops });
  };

  onChange = (e) => {
    this.setState({ search: e.target.value });
  };

  resetSearch = (e) => {
    ClientAPI.td().then((res) => {
      this.setState({ workshops: res.data, onResult: '', search: '' });
    });
  };

  render() {
    if (this.state.workshops.length === 0 && !this.state.onResult) {
      return <span>(Aucun TD pour l'instant)</span>;
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
          {this.state.onResult && this.state.workshops.length !== 0 && (
            <h4>
              {`Résultat(s) pour "${this.state.onResult}"`}{' '}
              <i
                onClick={this.resetSearch}
                style={{ cursor: 'pointer' }}
                className="far fa-window-close"
              />
            </h4>
          )}

          {this.state.onResult && this.state.workshops.length === 0 && (
            <h4>
              {`Aucun résultat pour "${this.state.onResult}"`}{' '}
              <i
                onClick={this.resetSearch}
                style={{ cursor: 'pointer' }}
                className="far fa-window-close"
              />
            </h4>
          )}
          <div style={{ marginTop: '30px' }}>
            {this.state.workshops.map((w) => {
              return (
                <Workshop
                  onDelete={this.onDelete}
                  admin
                  navigable
                  loc="list"
                  key={w._id}
                  workshop={w}
                />
              );
            })}
          </div>
        </div>
      )
    );
  }
}
