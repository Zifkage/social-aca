import React, { Component } from 'react';
import * as ClientAPI from '../ClientAPI';

export default class register extends Component {
  state = {
    form: {
      email: '',
      name: '',
      password: '',
      bio: '',
      psw: '',
      contact: '',
    },
  };

  onInputChange = ({ target }) => {
    switch (target.name) {
      case 'email': {
        this.setState({
          form: { ...this.state.form, email: target.value },
        });
        break;
      }
      case 'name': {
        this.setState({
          form: { ...this.state.form, name: target.value },
        });
        break;
      }
      case 'bio': {
        this.setState({
          form: { ...this.state.form, bio: target.value },
        });
        break;
      }
      case 'contact': {
        this.setState({
          form: { ...this.state.form, contact: target.value },
        });
        break;
      }
      case 'password': {
        this.setState({
          form: { ...this.state.form, password: target.value },
        });
        break;
      }
      case 'psw': {
        this.setState({
          form: { ...this.state.form, psw: target.value },
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

    if (this.state.form.psw !== this.state.form.password) {
      this.setState({ message: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    ClientAPI.createUser(this.state.form)
      .then((response) => {
        this.props.history.push('/student/login');
      })
      .catch((err) => {
        this.setState({
          message: 'Tous les champs doivent être remplis.',
        });
        console.log(err);
      });
  };
  render() {
    const { form, message } = this.state;
    return (
      <div>
        <h2>S'enregistrer</h2>
        <form onSubmit={this.onFormSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nom et prénom</label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              value={form.name}
              onChange={this.onInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="email"
              value={form.email}
              onChange={this.onInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact">Contact</label>
            <input
              type="text"
              name="contact"
              className="form-control"
              id="contact"
              value={form.contact}
              onChange={this.onInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Biographie</label>
            <textarea
              className="form-control"
              id="bio"
              rows="3"
              onChange={this.onInputChange}
              name="bio"
              value={form.bio}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pass">Mot de passe</label>
            <input
              type="password"
              name="password"
              className="form-control"
              id="pass"
              value={form.password}
              onChange={this.onInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="psw">Retaper mot de passe</label>
            <input
              type="password"
              name="psw"
              className="form-control"
              id="psw"
              value={form.psw}
              onChange={this.onInputChange}
            />
          </div>

          <button className="btn btn-primary">S'enregistrer</button>
          {message && (
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
          )}
        </form>
      </div>
    );
  }
}
