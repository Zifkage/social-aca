import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import * as ClientAPI from '../ClientAPI';

import Td from './Td';
import Pb from './Pb';
import Users from './Users';

class profile extends Component {
  state = {
    isLoading: true,
  };

  render() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) currentUser = JSON.parse(currentUser);

    const { match } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-4 list-group-item list-group-item-action">
            <NavLink
              exact
              activeClassName="active"
              to={`${match.url}`}
              className="list-group-item list-group-item-action "
            >
              Comptes étudiants
            </NavLink>
            <NavLink
              exact
              activeClassName="active"
              to={`${match.url}/td`}
              className="list-group-item list-group-item-action "
            >
              Travaux Dirigés
            </NavLink>
            <NavLink
              exact
              activeClassName="active"
              to={`${match.url}/pb`}
              className="list-group-item list-group-item-action "
            >
              Préoccupations
            </NavLink>
          </div>
          <div className="col-8">
            <Route exact path={`${match.url}`} component={Users} />
            <Route path={`${match.url}/td`} component={Td} />
            <Route path={`${match.url}/pb`} component={Pb} />
          </div>
        </div>
      </div>
    );
  }
}

export default profile;
