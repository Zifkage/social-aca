import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

class navbar extends Component {
  onLogout = () => {
    localStorage.removeItem('currentUser');
    this.props.history.push('/');
  };
  render() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) currentUser = JSON.parse(currentUser);

    return (
      <nav className='navbar fixed-top navbar-expand-lg navbar-dark bg-primary'>
        <div className='container'>
          <NavLink exact to='/' className='navbar-brand'>
            Social-Aca
          </NavLink>
          <button
            className='navbar-toggler'
            type='button'
            data-toggle='collapse'
            data-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon' />
          </button>
          <div className='collapse navbar-collapse' id='navbarNav'>
            <ul className='navbar-nav'>
              <li className='nav-item'>
                <NavLink
                  exact
                  className='nav-link'
                  activeClassName='active'
                  to='/'
                >
                  Accueil
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink
                  className='nav-link'
                  activeClassName='active'
                  to='/workshop'
                >
                  TD
                </NavLink>
              </li>

              {currentUser && (
                <li className='nav-item'>
                  <NavLink
                    className='nav-link'
                    activeClassName='active'
                    to={`/viewer/profile/${currentUser._id}`}
                  >
                    Profile-({currentUser.name})
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li className='nav-item'>
                  <NavLink
                    className='nav-link'
                    activeClassName='active'
                    to={`/notifications`}
                  >
                    Notifications
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li className='nav-item'>
                  <NavLink
                    className='nav-link'
                    activeClassName='active'
                    to={`/top`}
                  >
                    Top 10
                  </NavLink>
                </li>
              )}
              {!currentUser && (
                <li>
                  <NavLink
                    activeClassName='active'
                    to='/login'
                    className='btn btn-success'
                  >
                    se connecter
                  </NavLink>
                </li>
              )}
              {!currentUser && (
                <li>
                  <NavLink
                    activeClassName='active'
                    to='/register'
                    className='btn btn-primary'
                  >
                    s'enregistrer
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li>
                  <button
                    onClick={e => this.onLogout()}
                    className='btn btn-danger'
                  >
                    se déconnecter
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(navbar);
