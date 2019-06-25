import React, { Component } from 'react';
import * as ClientAPI from '../ClientAPI';

import PostsList from './postsList';

export default class Pb extends Component {
  state = {
    search: '',
    posts: [],
    isloading: false,
    onResult: '',
  };

  componentDidMount() {
    ClientAPI.pb().then((res) => {
      this.setState({ posts: res.data });
    });
  }

  onSearch = (e) => {
    e.preventDefault();
    if (!this.state.search) return;
    ClientAPI.pb(this.state.search).then((res) => {
      this.setState({ posts: res.data, onResult: this.state.search });
    });
  };

  onDelete = async (id) => {
    let newPosts = [...this.state.posts];
    newPosts = newPosts.filter((p) => p._id !== id);
    await ClientAPI.delpb(id);
    this.setState({ posts: newPosts });
  };

  onChange = (e) => {
    this.setState({ search: e.target.value });
  };

  resetSearch = (e) => {
    ClientAPI.pb().then((res) => {
      this.setState({ posts: res.data, onResult: '', search: '' });
    });
  };

  render() {
    if (this.state.posts.length === 0 && !this.state.onResult) {
      return <span>(Aucune préoccupation pour l'instant)</span>;
    }
    return (
      <div>
        {this.state.posts[0] && (
          <div>
            <form
              onSubmit={this.onSearch}
              className="navbar-form"
              role="search"
            >
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
            {this.state.onResult && this.state.posts.length !== 0 && (
              <h4>
                {`Résultat(s) pour "${this.state.onResult}"`}{' '}
                <i
                  onClick={this.resetSearch}
                  style={{ cursor: 'pointer' }}
                  className="far fa-window-close"
                />
              </h4>
            )}

            {this.state.onResult && this.state.posts.length === 0 && (
              <h4>
                {`Aucun résultat pour "${this.state.onResult}"`}{' '}
                <i
                  onClick={this.resetSearch}
                  style={{ cursor: 'pointer' }}
                  className="far fa-window-close"
                />
              </h4>
            )}
            <PostsList
              onDelete={this.onDelete}
              admin
              onVote={this.onVote}
              postNavigable={true}
              posts={this.state.posts}
              type="post"
            />
          </div>
        )}
      </div>
    );
  }
}
