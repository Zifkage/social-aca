import React, { Component } from 'react';
import * as ClientAPI from '../ClientAPI';

import PostsList from './postsList';

export default class MyPb extends Component {
  state = {
    posts: []
  };

  componentDidMount() {
    ClientAPI.mypb().then(res => {
      this.setState({ posts: res.data });
    });
  }

  onVote = (postId, payload) => {
    const newPosts = [...this.state.posts];
    const post = newPosts.find(res => {
      return res._id === postId;
    });
    post.votes.push({
      ...payload,
      author: JSON.parse(localStorage.getItem('currentUser'))
    });
    ClientAPI.votePost(post._id, payload).then(res => {
      this.setState({
        post: newPosts
      });
    });
  };

  render() {
    if (this.state.posts.length === 0) {
      return <span>(Vous n'avez posté aucune préoccupation)</span>;
    }
    return (
      <div>
        {this.state.posts[0] && (
          <PostsList
            onVote={this.onVote}
            postNavigable={true}
            posts={this.state.posts}
            type='post'
          />
        )}
      </div>
    );
  }
}
