import React, { Component } from 'react';
import * as ClientAPI from '../ClientAPI';

export default class createWorkshop extends Component {
  state = {
    form: {
      title: '',
      description: '',
      duration: '',
      location: '',
      dateStart: '',
    },
    message: '',
  };

  onInputChange = ({ target }) => {
    switch (target.name) {
      case 'title': {
        this.setState({
          form: { ...this.state.form, title: target.value },
        });
        break;
      }
      case 'description': {
        this.setState({
          form: { ...this.state.form, description: target.value },
        });
        break;
      }
      case 'duration': {
        this.setState({
          form: { ...this.state.form, duration: target.value },
        });
        break;
      }
      case 'dateStart': {
        console.log(target.value);
        this.setState({
          form: { ...this.state.form, dateStart: target.value },
        });
        break;
      }
      case 'location': {
        this.setState({
          form: { ...this.state.form, location: target.value },
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
    ClientAPI.createWorkshop(this.state.form)
      .then((response) => {
        this.setState({
          form: {
            title: '',
            description: '',
            duration: '',
            location: '',
            dateStart: '',
          },
          message: 'TD poster avec succès',
        });
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
        <form onSubmit={this.onFormSubmit}>
          <div className="form-group">
            <label htmlFor="exampleFormControlInput1">Titre</label>
            <input
              type="text"
              name="title"
              className="form-control"
              id="exampleFormControlInput1"
              value={form.title}
              onChange={this.onInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlInput1">Localisation</label>
            <input
              type="text"
              name="location"
              className="form-control"
              id="exampleFormControlInput1"
              value={form.location}
              onChange={this.onInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlInput1">Date</label>
            <input
              type="datetime-local"
              name="dateStart"
              className="form-control"
              id="exampleFormControlInput1"
              value={form.dateStart}
              onChange={this.onInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlInput1">Durée</label>
            <input
              type="time"
              name="duration"
              className="form-control"
              id="exampleFormControlInput1"
              value={form.duration}
              onChange={this.onInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlTextarea1">
              Description du TD
            </label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              onChange={this.onInputChange}
              name="description"
              value={form.description}
            />
          </div>
          <button className="btn btn-primary">Poster</button>
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
