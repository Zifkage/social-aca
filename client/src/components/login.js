import React, { Component } from 'react';
import * as ClientAPI from '../ClientAPI';

class login extends Component {
  state = {
    form: {
      email: '',
      password: '',
    },
  };

  onInputChange = ({ target }) => {
    switch (target.type) {
      case 'email': {
        this.setState({
          form: { ...this.state.form, email: target.value },
        });
        break;
      }
      case 'password': {
        this.setState({
          form: { ...this.state.form, password: target.value },
        });
        break;
      }
      default: {
        return;
      }
    }
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    ClientAPI.login(this.state.form)
      .then((response) => {
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        this.props.history.push(this.props.redirectTo);
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div>
        <h2>Se connecter</h2>
        <form onSubmit={this.onFormSubmit}>
          <div className="form-group">
            <input
              onChange={this.onInputChange}
              id="email"
              type="email"
              className="form-control"
              placeholder="Email"
              value={this.state.form.email}
            />
          </div>
          <div className="form-group">
            <input
              onChange={this.onInputChange}
              id="password"
              type="password"
              className="form-control"
              placeholder="Mot de passe"
              value={this.state.form.password}
            />
          </div>
          <button className="btn">valider</button>
        </form>
      </div>
    );
  }
}

export default login;
