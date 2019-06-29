import React, { Component } from 'react';
import * as ClientAPI from '../ClientAPI';
import { withRouter } from 'react-router-dom';
import Post from './post';
import PostsList from './postsList';
import BackButton from './back';

export default withRouter(
  class postPage extends Component {
    state = {
      isLoading: true,
      post: {},
      form: {
        body: '',
        file: null,
      },
      isSending: false,
      message: '',
    };

    componentDidMount() {
      const {
        match: { params },
      } = this.props;
      ClientAPI.getPost(params.postId).then((res) => {
        this.setState({ post: res.data, isLoading: false });
      });
    }

    onInputChange = (e) => {
      if (e.target.name === 'file') {
        this.setState({
          form: { ...this.state.form, file: e.target.files[0] },
        });
        return;
      }
      this.setState({ form: { ...this.state.form, body: e.target.value } });
    };

    onSubmit = (e) => {
      const { post, form } = this.state;
      e.preventDefault();
      this.setState({ isSending: true });
      const data = new FormData();
      data.append('file', form.file);
      data.append('body', form.body);
      ClientAPI.createResponse(post._id, data).then((res) => {
        this.setState({
          isSending: false,
          message: 'Votre reponse a été bien envoyé',
          form: { body: '', file: null },
        });
      });
    };

    onVote = (target) => {
      return (responseId, payload) => {
        if (target === 'post') {
          ClientAPI.votePost(this.state.post._id, payload).then((res) => {
            this.setState({
              post: {
                ...this.state.post,
                votes: [
                  ...this.state.post.votes,
                  {
                    ...payload,
                    author: JSON.parse(localStorage.getItem('currentUser')),
                  },
                ],
              },
            });
          });
        } else {
          const newResponses = [...this.state.post.responses];
          const response = newResponses.find((res) => {
            return res._id === responseId;
          });
          response.votes.push({
            ...payload,
            author: JSON.parse(localStorage.getItem('currentUser')),
          });
          ClientAPI.voteResponse(this.state.post._id, responseId, payload).then(
            (res) => {
              this.setState({
                post: {
                  ...this.state.post,
                  responses: newResponses,
                },
              });
            },
          );
        }
      };
    };

    onSolve = (responseId) => {
      const newResponses = [...this.state.post.responses];
      const response = newResponses.find((res) => {
        return res._id === responseId;
      });
      response.solution = true;
      ClientAPI.solvePost(this.state.post._id, responseId).then((res) => {
        this.setState({
          post: {
            ...this.state.post,
            responses: newResponses,
          },
        });
      });
    };

    render() {
      const { post, form, message } = this.state;
      let solution = null;
      if (this.state.post.responses) {
        solution = this.state.post.responses.find((res) => res.solution);
      }
      return (
        <div>
          {this.state.isLoading ? (
            'Chargement'
          ) : (
            <div>
              <BackButton />
              <div>
                <Post onVote={this.onVote('post')} post={post} />

                {solution && (
                  <div>
                    <h4>Solution</h4>
                    <Post
                      type="response"
                      onVote={this.onVote('response')}
                      post={solution}
                      postAuthor={this.state.post.author}
                    />
                  </div>
                )}
              </div>
              <br />
              <br />
              <h4>{post.responses.length} réponse(s)</h4>
              <div>
                {this.state.isSending ? (
                  'Envoie en cours...'
                ) : (
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label htmlFor="exampleFormControlTextarea1">
                        Entrer une réponse
                      </label>
                      <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows="3"
                        onChange={this.onInputChange}
                        name="body"
                        value={form.body}
                      />
                      <div className="form-group">
                        <label>Fichier</label>
                        <input
                          type="file"
                          name="file"
                          className="form-control"
                          onChange={this.onInputChange}
                        />
                      </div>
                    </div>
                    <button className="btn btn-primary">Poster</button>
                    {message && (
                      <div className="collection">
                        <div className="alert alert-warning" role="alert">
                          {message}
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>
              <br />
              <PostsList
                onVote={this.onVote('response')}
                posts={post.responses}
                type="response"
                postAuthor={this.state.post.author}
                onSolve={this.onSolve}
              />
            </div>
          )}
        </div>
      );
    }
  },
);
