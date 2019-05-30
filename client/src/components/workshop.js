import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import * as ClientAPI from '../ClientAPI';

export default class workshop extends Component {
  state = {
    participe: false,
    participants: [...this.props.workshop.participants]
  };

  onParticipate = () => {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) currentUser = JSON.parse(currentUser);
    const {
      workshop: { _id }
    } = this.props;
    ClientAPI.participateWorkshop(_id)
      .then(res => {
        console.log(res.data);
        this.setState({
          participe: true,
          participants: [...this.state.participants, currentUser]
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    const { workshop, loc, navigable } = this.props;
    const { participants } = this.state;

    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) currentUser = JSON.parse(currentUser);
    const userParticipate = workshop.participants.find(
      p => p._id === currentUser._id
    );
    moment.locale('fr');
    return (
      <div>
        <div className='card border-dark mb-3'>
          <div className='card-header'>
            {' '}
            <img
              style={{ width: '50px' }}
              src='/costar.jpg'
              className='img-thumbnail'
              alt='costar'
            />
            <span>{workshop.author.name}</span>
          </div>
          <div className='card-body text-dark'>
            {navigable ? (
              <Link
                style={{
                  color: 'black',
                  display: 'block',
                  textDecoration: 'none'
                }}
                to={`/workshop/${workshop._id}`}
              >
                <h5 className='card-title'>
                  {workshop.title}{' '}
                  <span style={{ color: 'grey' }}>#{workshop.course}</span>
                </h5>
                <p className='card-text'>{workshop.description}</p>
              </Link>
            ) : (
              <div>
                <h5 className='card-title'>{workshop.title}</h5>
                <p className='card-text'>{workshop.description}</p>
              </div>
            )}

            <div style={{ marginTop: '50px' }} className='wdetail'>
              <span>
                <i className='fas fa-stopwatch' />
                {workshop.duration}
              </span>
              <span>
                <i className='far fa-calendar-alt' />
                {moment(workshop.dateStart).format('LLLL')}
              </span>
              <br />
              <span>
                <i className='fas fa-map-marked-alt' />
                {workshop.location}
              </span>
            </div>
            {currentUser._id !== workshop.author._id && (
              <button
                onClick={() =>
                  userParticipate || this.state.participe
                    ? ''
                    : this.onParticipate()
                }
                className={`btn ${
                  userParticipate || this.state.participe
                    ? 'btn-success'
                    : 'btn-primary'
                }`}
              >
                {userParticipate || this.state.participe
                  ? 'Participe'
                  : 'Participer'}
              </button>
            )}
          </div>
        </div>
        {loc !== 'list' && (
          <div>
            <h3>{`${this.state.participants.length} participant(s)`}</h3>
            <ul className='list-group'>
              {participants.map(p => (
                <li
                  className='list-group-item list-group-item-dark'
                  key={p._id}
                  style={{ marginBottom: '10px' }}
                >
                  <img
                    style={{ width: '50px' }}
                    src='/costar.jpg'
                    className='img-thumbnail'
                    alt='costar'
                  />
                  <Link style={{ color: 'black' }} to={`/profile/${p._id}`}>
                    {p.name}
                  </Link>{' '}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
