import React, { Component } from 'react';
import * as client from '../ClientAPI';
import { Link } from 'react-router-dom';

export default class top extends Component {
  state = {
    users: []
  };

  async componentDidMount() {
    const res = await client.top();
    this.setState({
      users: res.data
    });
  }

  render() {
    const { users } = this.state;

    return (
      <div>
        <h3 className='mb'>Les meilleur résolveurs des 7 derniers jours</h3>
        <ul className='list-group'>
          {users.map((u, i) => {
            if (i == 0) {
              return (
                <li
                  className='list-group-item list-group-item-warning'
                  key={u._id}
                  style={{ marginBottom: '10px' }}
                >
                  <span className='top-n'>{i + 1}</span>
                  <img
                    style={{ width: '50px' }}
                    src='/costar.jpg'
                    className='img-thumbnail'
                    alt='costar'
                  />
                  <Link style={{ color: 'black' }} to={`/profile/${u._id}`}>
                    {u.name}
                  </Link>{' '}
                </li>
              );
            } else if (i == 1) {
              return (
                <li
                  className='list-group-item list-group-item-primary'
                  key={u._id}
                  style={{ marginBottom: '10px' }}
                >
                  <span className='top-n'>{i + 1}</span>
                  <img
                    style={{ width: '50px' }}
                    src='/costar.jpg'
                    className='img-thumbnail'
                    alt='costar'
                  />
                  <Link style={{ color: 'black' }} to={`/profile/${u._id}`}>
                    {u.name}
                  </Link>{' '}
                </li>
              );
            } else if (i == 2) {
              return (
                <li
                  className='list-group-item list-group-item-secondary'
                  key={u._id}
                  style={{ marginBottom: '10px' }}
                >
                  <span className='top-n'>{i + 1}</span>
                  <img
                    style={{ width: '50px' }}
                    src='/costar.jpg'
                    className='img-thumbnail'
                    alt='costar'
                  />
                  <Link style={{ color: 'black' }} to={`/profile/${u._id}`}>
                    {u.name}
                  </Link>{' '}
                </li>
              );
            }
            return (
              <li
                className='list-group-item list-group-item-light'
                key={u._id}
                style={{ marginBottom: '10px' }}
              >
                <span className='top-n'>{i + 1}</span>
                <img
                  style={{ width: '50px' }}
                  src='/costar.jpg'
                  className='img-thumbnail'
                  alt='costar'
                />
                <Link style={{ color: 'black' }} to={`/profile/${u._id}`}>
                  {u.name}
                </Link>{' '}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
