import React, { Component } from 'react';
import * as ClientAPI from '../ClientAPI';

export default class createPost extends Component {
  state = {
    form: {
      title: '',
      body: '',
      course: ''
    },
    message: ''
  };

  onInputChange = ({ target }) => {
    switch (target.name) {
      case 'title': {
        this.setState({
          form: { ...this.state.form, title: target.value }
        });
        break;
      }
      case 'body': {
        this.setState({
          form: { ...this.state.form, body: target.value }
        });
        break;
      }
      case 'course': {
        this.setState({
          form: { ...this.state.form, course: target.value }
        });
        break;
      }
      default: {
        return;
      }
    }
  };

  onFormSubmit = e => {
    e.preventDefault();
    ClientAPI.createPost(this.state.form)
      .then(response => {
        this.setState({
          form: {
            title: '',
            body: '',
            course: ''
          },
          message: 'Problème posté avec succès'
        });
        setTimeout(() => this.setState({ message: '' }), 1500);
      })
      .catch(err => {
        this.setState({
          message: 'Tous les champs doivent être remplis.'
        });
        console.log(err);
      });
  };
  render() {
    const { form, message } = this.state;
    const courses = [
      'calcul matriciel',
      'analyse numérique',
      'théorie des nombres',
      'probabilité',
      'statistique',
      'série numérique',
      'structure algégrique'
    ].sort();
    return (
      <form onSubmit={this.onFormSubmit}>
        <div className='form-group'>
          <label htmlFor='exampleFormControlInput1'>Titre</label>
          <input
            type='text'
            name='title'
            className='form-control'
            id='exampleFormControlInput1'
            value={form.title}
            onChange={this.onInputChange}
          />
        </div>
        <div className='form-group'>
          <label>Matiére</label>
          <select
            name='course'
            onChange={this.onInputChange}
            value={form.course}
            className='form-control'
            id='exampleFormControlSelect1'
          >
            <option disabled selected value=''>
              ------
            </option>
            {courses.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='exampleFormControlTextarea1'>
            Description de problème
          </label>
          <textarea
            className='form-control'
            id='exampleFormControlTextarea1'
            rows='3'
            onChange={this.onInputChange}
            name='body'
            value={form.body}
          />
        </div>
        <button className='btn btn-primary'>Poster</button>
        {message && (
          <div className='alert alert-warning' role='alert'>
            {message}
          </div>
        )}
      </form>
    );
  }
}
