import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

class navbar extends Component {
  onLogout = () => {
    localStorage.removeItem('currentUser');
    this.props.history.push('/admin');
  };
  render() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) currentUser = JSON.parse(currentUser);

    return (
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-danger">
        <div className="container">
          <NavLink exact to="/admin" className="navbar-brand">
            Social-Aca(Admin)
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {!currentUser && (
                <li>
                  <NavLink
                    activeClassName="active"
                    to="/admin"
                    className="btn btn-success"
                  >
                    se connecter
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li>
                  <button
                    onClick={(e) => this.onLogout()}
                    className="btn btn-danger"
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
