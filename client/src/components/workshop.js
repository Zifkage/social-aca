import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import * as ClientAPI from '../ClientAPI';

export default class workshop extends Component {
  state = {
    participe: false,
    participants: [...this.props.workshop.participants],
    notes: [...this.props.workshop.notes],
    note: '',
    message: '',
  };

  onParticipate = () => {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) currentUser = JSON.parse(currentUser);
    const {
      workshop: { _id },
    } = this.props;
    ClientAPI.participateWorkshop(_id)
      .then((res) => {
        console.log(res.data);
        this.setState({
          participe: true,
          participants: [...this.state.participants, currentUser],
        });
      })
      .catch((err) => console.log(err));
  };

  onNote = async () => {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) currentUser = JSON.parse(currentUser);
    const { _id } = this.props.workshop;
    if (!this.state.note) {
      return this.setState({
        message: 'Selectionnez une note',
      });
    }
    try {
      await ClientAPI.note(_id, this.state.note, currentUser._id.toString());
      this.setState({
        notes: [
          ...this.state.notes,
          { userId: currentUser._id.toString(), point: this.state.note },
        ],
        message: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  onNoteChange = (e) => {
    this.setState({ note: e.target.value });
  };
  render() {
    const { workshop, loc, navigable, participations } = this.props;
    const { participants, note } = this.state;

    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) currentUser = JSON.parse(currentUser);
    const userParticipate = workshop.participants.find(
      (p) => p._id === currentUser._id,
    );
    moment.locale('fr');
    const userNote = this.state.notes.find((n) => n.userId === currentUser._id);
    const timeToNote = Date.now() - new Date(workshop.dateStart).getTime() >= 0;
    if (timeToNote && !userParticipate) return null;
    return (
      <div>
        <div className="card border-dark mb-3">
          <div className="card-header">
            {' '}
            <img
              style={{ width: '50px' }}
              src="/costar.jpg"
              className="img-thumbnail"
              alt="costar"
            />
            <span>{workshop.author.name}</span>
          </div>
          <div className="card-body text-dark">
            {navigable && !this.props.admin ? (
              <Link
                style={{
                  color: 'black',
                  display: 'block',
                  textDecoration: 'none',
                }}
                to={`/student/workshop/${workshop._id}`}
              >
                <h5 className="card-title">
                  {workshop.title}{' '}
                  <span style={{ color: 'grey' }}>#{workshop.course}</span>
                </h5>
                <p className="card-text">{workshop.description}</p>
              </Link>
            ) : (
              <div>
                <h5 className="card-title">{workshop.title}</h5>
                <p className="card-text">{workshop.description}</p>
              </div>
            )}

            <div style={{ marginTop: '50px' }} className="wdetail">
              <span>
                <i className="fas fa-stopwatch" />
                {workshop.duration}
              </span>
              <span>
                <i className="far fa-calendar-alt" />
                {moment(workshop.dateStart).format('LLLL')}
              </span>
              <br />
              <span>
                <i className="fas fa-map-marked-alt" />
                {workshop.location}
              </span>
            </div>
            {(this.props.admin || workshop.author._id === currentUser._id) &&
              this.props.onDelete && (
                <button
                  onClick={() => this.props.onDelete(workshop._id)}
                  className="btn btn-danger"
                >
                  supprimer
                </button>
              )}
            {currentUser._id !== workshop.author._id && !this.props.admin && (
              <div>
                {!participations && !timeToNote ? (
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
                    {(userParticipate && !timeToNote) || this.state.participe
                      ? 'Participe'
                      : 'Participer'}
                  </button>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    {!userNote ? (
                      <div>
                        <h4 className="text-primary">En attente de note</h4>
                        <select
                          style={{
                            width: '65px',
                            display: 'inline-block',
                            fontSize: '25px',
                          }}
                          name="course"
                          onChange={this.onNoteChange}
                          value={note}
                          className="form-control"
                          id="exampleFormControlSelect1"
                        >
                          <option disabled selected value="">
                            ---
                          </option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                        </select>{' '}
                        <span
                          style={{
                            fontSize: '25px',
                          }}
                        >
                          {' '}
                          / 5
                        </span>{' '}
                        <br />
                        {this.state.message && (
                          <span>{this.state.message}</span>
                        )}
                        <br />
                        <button
                          onClick={this.onNote}
                          className="btn btn-warning"
                        >
                          Soumettre note
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-success">Vous avez noté</h4>
                        <select
                          disabled
                          style={{
                            width: '65px',
                            display: 'inline-block',
                            fontSize: '25px',
                          }}
                          name="course"
                          value={userNote.point}
                          className="form-control"
                          id="exampleFormControlSelect1"
                        >
                          <option disabled selected value="">
                            ---
                          </option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                        </select>{' '}
                        <span
                          style={{
                            fontSize: '25px',
                          }}
                        >
                          {' '}
                          / 5
                        </span>{' '}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {loc !== 'list' && (
          <div>
            <h3>{`${this.state.participants.length} participant(s)`}</h3>
            <ul className="list-group">
              {participants.map((p) => (
                <li
                  className="list-group-item list-group-item-dark"
                  key={p._id}
                  style={{ marginBottom: '10px' }}
                >
                  <img
                    style={{ width: '50px' }}
                    src="/costar.jpg"
                    className="img-thumbnail"
                    alt="costar"
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
