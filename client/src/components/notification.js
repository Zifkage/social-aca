import React, { Component } from 'react';
import { getNotifications } from '../ClientAPI';
import { Link } from 'react-router-dom';

export default class Notification extends Component {
  state = {
    notifications: [],
  };
  componentDidMount() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) currentUser = JSON.parse(currentUser);
    getNotifications(currentUser._id).then(({ data }) => {
      this.setState({
        notifications: data,
      });
    });
  }

  render() {
    const { notifications } = this.state;
    const sortedNotif = notifications.sort((a, b) => b.createdAt - a.createdAt);
    const readedNotif = sortedNotif.filter((n) => n.read);
    const unreadedNotif = sortedNotif.filter((n) => !n.read);

    return (
      <div>
        <h3>Nouvelles notifications</h3>
        {unreadedNotif.length === 0 ? (
          <span>(Aucune notifications)</span>
        ) : (
          <ul className="list-group">
            {unreadedNotif.map((n) => {
              let targetUrl = '';
              switch (n.type) {
                case 'RESPONSE':
                  targetUrl = '/post/';
                  break;
                case 'FOLLOW':
                  targetUrl = '/profile/';
                  break;
                case 'WORKSHOP':
                  targetUrl = '/workshop/';
                  break;
              }
              return (
                <li
                  className="list-group-item list-group-item-dark"
                  key={n._id}
                  style={{ marginBottom: '10px' }}
                >
                  <img
                    style={{ width: '50px' }}
                    src="/costar.jpg"
                    className="img-thumbnail"
                    alt="costar"
                  />
                  <Link
                    style={{ color: 'black' }}
                    to={'/student' + targetUrl + n.targetEntity}
                  >
                    {n.body}
                  </Link>{' '}
                </li>
              );
            })}
          </ul>
        )}
        <h3>Anciennes notifications</h3>
        {readedNotif.length === 0 ? (
          <span>(Aucune notifications)</span>
        ) : (
          <ul className="list-group">
            {readedNotif.map((n) => {
              let targetUrl = '';
              switch (n.type) {
                case 'RESPONSE':
                  targetUrl = '/post/';
                  break;
                case 'FOLLOW':
                  targetUrl = '/profile/';
                  break;
                case 'WORKSHOP':
                  targetUrl = '/workshop/';
                  break;
              }
              return (
                <li
                  className="list-group-item list-group-item-dark"
                  key={n._id}
                  style={{ marginBottom: '10px' }}
                >
                  <img
                    style={{ width: '50px' }}
                    src="/costar.jpg"
                    className="img-thumbnail"
                    alt="costar"
                  />
                  <Link
                    style={{ color: 'black' }}
                    to={'/student' + targetUrl + n.targetEntity}
                  >
                    {n.body}
                  </Link>{' '}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}
