import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import CreatePost from './createPost';
import * as ClientAPI from '../ClientAPI';
import CreateWorkshop from './createWorkshop';
import UserInfo from './userInfo';

const resolveFollowUserQuery = () => state => {
  let currentUser = localStorage.getItem('currentUser');
  if (currentUser) currentUser = JSON.parse(currentUser);

  return {
    ...state,
    userInfo: {
      ...state.userInfo,
      followers: [...state.userInfo.followers, currentUser]
    }
  };
};

class profile extends Component {
  state = {
    isLoading: true,
    userInfo: '',
    courses: [],
    message: ''
  };

  componentDidMount() {
    const {
      match: {
        params: { userId }
      }
    } = this.props;
    ClientAPI.getUser(userId)
      .then(res1 => {
        ClientAPI.getTrackcourses(userId)
          .then(res2 =>
            this.setState({
              isLoading: false,
              userInfo: res1.data,
              courses: res2.data.courses
            })
          )
          .catch(console.log);
      })
      .catch(err => console.log(err));
  }

  onFollow = userId => {
    ClientAPI.followUser(userId)
      .then(res => {
        console.log(res.data);
        this.setState(resolveFollowUserQuery());
      })
      .catch(err => console.log(err));
  };

  onCheckChange = e => {
    if (e.target.checked) {
      return this.setState({
        courses: [...this.state.courses, e.target.value]
      });
    }
    let oldState = [...this.state.courses];
    const newState = oldState.filter(c => c !== e.target.value);
    this.setState({ courses: newState });
  };

  onSubmitCourses = e => {
    const {
      match: {
        params: { userId }
      }
    } = this.props;
    e.preventDefault();
    ClientAPI.trackcourses(userId, this.state.courses)
      .then(res => {
        console.log(res.data);
        this.setState({ message: 'paramétres enregistrés' });
        setTimeout(() => this.setState({ message: '' }), 1500);
      })
      .catch(console.log);
  };

  render() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) currentUser = JSON.parse(currentUser);
    const {
      userInfo: { followers, following }
    } = this.state;
    let followerIndex = null;
    let alreadySub = null;
    if (this.state.userInfo) {
      followerIndex = followers.findIndex(f => f._id === currentUser._id);
      alreadySub = followerIndex === -1 ? false : true;
    }
    const { match } = this.props;
    const courses = [
      'calcul matriciel',
      'analyse numérique',
      'théorie des nombres',
      'probabilité',
      'statistique',
      'série numérique',
      'structure algégrique'
    ].sort();
    return !this.state.isLoading ? (
      <div className='row'>
        <div className='col-4 list-group-item list-group-item-action'>
          <NavLink
            exact
            activeClassName='active'
            to={`${match.url}`}
            className='list-group-item list-group-item-action '
          >
            Info utilisateur
          </NavLink>
          <NavLink
            exact
            activeClassName='active'
            to={`${match.url}/followers`}
            className='list-group-item list-group-item-action '
          >
            Abonnées
          </NavLink>
          <NavLink
            exact
            activeClassName='active'
            to={`${match.url}/following`}
            className='list-group-item list-group-item-action '
          >
            Abonnement
          </NavLink>
          {this.state.userInfo._id === currentUser._id && (
            <NavLink
              activeClassName='active'
              to={`${match.url}/create-post`}
              className='list-group-item list-group-item-action '
            >
              Poster un problème
            </NavLink>
          )}
          {this.state.userInfo._id === currentUser._id && (
            <NavLink
              activeClassName='active'
              to={`${match.url}/create-workshop`}
              className='list-group-item list-group-item-action'
            >
              Créer un TD
            </NavLink>
          )}
          {this.state.userInfo._id === currentUser._id && (
            <NavLink
              activeClassName='active'
              to={`${match.url}/config`}
              className='list-group-item list-group-item-action '
            >
              Paramètrages
            </NavLink>
          )}
        </div>
        <div className='col-8'>
          <Route
            exact
            path={`${match.url}`}
            render={() => {
              return (
                <UserInfo
                  alreadySub={alreadySub}
                  onFollow={this.onFollow}
                  user={this.state.userInfo}
                />
              );
            }}
          />
          <Route path={`${match.url}/create-post`} component={CreatePost} />
          <Route
            path={`${match.url}/create-workshop`}
            component={CreateWorkshop}
          />
          <Route
            path={`${match.url}/followers`}
            render={() => (
              <div>
                <h3>{`${followers.length} abonné(s)`}</h3>
                <ul className='list-group'>
                  {followers.map(p => (
                    <li
                      className='list-group-item list-group-item-success'
                      key={p._id}
                    >
                      <img
                        style={{ width: '50px' }}
                        src='/costar.jpg'
                        className='img-thumbnail'
                        alt='costar'
                      />
                      <NavLink to={`/profile/${p._id}`}>{p.name}</NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          />
          <Route
            path={`${match.url}/following`}
            render={() => (
              <div>
                <h3>{`${following.length} abonnement(s)`}</h3>
                <ul className='list-group'>
                  {following.map(p => (
                    <li
                      className='list-group-item list-group-item-success'
                      key={p._id}
                      style={{ marginBottom: '10px' }}
                    >
                      <img
                        style={{ width: '50px' }}
                        src='/costar.jpg'
                        className='img-thumbnail'
                        alt='costar'
                      />
                      <NavLink to={`/profile/${p._id}`}>{p.name}</NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          />
          <Route
            path={`${match.url}/config`}
            render={() => (
              <div>
                <h2>Paramètrages</h2>
                <br />
                <h4>Choisissez les matières qui vous posent problème</h4>
                <form onSubmit={this.onSubmitCourses}>
                  {courses.map(c => (
                    <div
                      style={{ fontSize: '18px' }}
                      className='form-check form-check-inline'
                    >
                      <input
                        onChange={this.onCheckChange}
                        className='form-check-input'
                        type='checkbox'
                        id='inlineCheckbox1'
                        value={c}
                        checked={this.state.courses.includes(c)}
                      />
                      <label className='form-check-label'>{c}</label>
                    </div>
                  ))}
                  <br />
                  <br />

                  <button className='btn btn-primary'>Enregistrer</button>
                  {this.state.message && (
                    <span className='alert alert-success'>
                      {this.state.message}
                    </span>
                  )}
                </form>
              </div>
            )}
          />
        </div>
      </div>
    ) : (
      <div>Chargement</div>
    );
  }
}

export default profile;
