import React, { Component } from 'react';
import * as api from '../ClientAPI';

export default class Users extends Component {
  state = {
    search: '',
    users: [],
    isloading: false,
    onResult: '',
  };

  async componentDidMount() {
    let { data: users } = await api.users();
    this.setState({ users });
  }

  onSearch = (e) => {
    e.preventDefault();
    if (!this.state.search) return;
    api.users(this.state.search).then((res) => {
      this.setState({ users: res.data, onResult: this.state.search });
    });
  };

  onDelete = async (id) => {
    let newUser = [...this.state.users];
    newUser = newUser.filter((p) => p._id !== id);
    await api.deluser(id);
    this.setState({ users: newUser });
  };

  onChange = (e) => {
    this.setState({ search: e.target.value });
  };

  resetSearch = (e) => {
    api.users().then((res) => {
      this.setState({ users: res.data, onResult: '', search: '' });
    });
  };

  render() {
    if (this.state.users.length === 0 && !this.state.onResult) {
      return <span>(Aucun utilisateur)</span>;
    }
    const { users } = this.state;
    return (
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
        {this.state.onResult && this.state.users.length !== 0 && (
          <h4>
            {`Résultat(s) pour "${this.state.onResult}"`}{' '}
            <i
              onClick={this.resetSearch}
              style={{ cursor: 'pointer' }}
              className="far fa-window-close"
            />
          </h4>
        )}

        {this.state.onResult && this.state.users.length === 0 && (
          <h4>
            {`Aucun résultat pour "${this.state.onResult}"`}{' '}
            <i
              onClick={this.resetSearch}
              style={{ cursor: 'pointer' }}
              className="far fa-window-close"
            />
          </h4>
        )}
        <ul className="list-group">
          {users.map((u) => {
            return (
              <li
                className="list-group-item list-group-item-light"
                key={u._id}
                style={{ marginBottom: '10px' }}
              >
                <img
                  style={{ width: '50px' }}
                  src="/costar.jpg"
                  className="img-thumbnail"
                  alt="costar"
                />
                <span style={{ color: 'black' }} to={`/profile/${u._id}`}>
                  {u.name}
                </span>{' '}
                <br />
                <button
                  onClick={() => this.onDelete(u._id)}
                  className="btn btn-danger"
                >
                  supprimer
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
