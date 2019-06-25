import React from 'react';
import { Link } from 'react-router-dom';

const post = (props) => {
  let solution = null;
  let toProfile = '';

  if (props.post.responses) {
    solution = props.post.responses.find((res) => res.solution);
  }
  const user = JSON.parse(localStorage.getItem('currentUser'));

  let userVote = null;
  if (user) {
    toProfile =
      props.post.author._id === user._id
        ? `/viewer/profile/${props.post.author._id}`
        : `/profile/${props.post.author._id}`;
    userVote = props.post.votes.find((v) => {
      return v.author._id === user._id;
    });
  } else {
    toProfile = `/profile/${props.post.author._id}`;
  }
  const upCount = props.post.votes.filter((v) => {
    return v.type === 'up';
  }).length;
  const downCount = props.post.votes.filter((v) => {
    return v.type === 'down';
  }).length;

  return (
    <div>
      {!props.admin && (
        <div className="vote">
          <div
            onClick={() => props.onVote(props.post._id, { type: 'up' })}
            className="up"
          >
            <i
              style={{
                color: userVote && userVote.type === 'up' ? 'green' : 'black',
                cursor: 'pointer',
              }}
              className="fas fa-angle-up"
            />
          </div>
          <div
            className="count"
            style={{ color: upCount - downCount > 0 ? 'green' : 'red' }}
          >
            {upCount - downCount}
          </div>
          <div
            onClick={() => props.onVote(props.post._id, { type: 'down' })}
            className="down"
          >
            <i
              style={{
                color: userVote && userVote.type === 'down' ? 'red' : 'black',
                cursor: 'pointer',
              }}
              className="fas fa-angle-down"
            />
          </div>
        </div>
      )}
      {!props.admin && (
        <div
          style={{ background: upCount - downCount > 0 ? 'green' : 'red' }}
          className="hline"
        />
      )}
      <div className="post">
        <img
          style={{ width: '50px' }}
          src="/costar.jpg"
          className="img-thumbnail"
          alt="costar"
        />
        <span>
          {props.admin ? (
            <span>{props.post.author.name}</span>
          ) : (
            <Link to={toProfile}>{props.post.author.name}</Link>
          )}
        </span>
        <b>
          <h4>
            {props.navigable && !props.admin ? (
              <Link
                style={{ color: 'black', display: 'block' }}
                to={`/student/post/${props.post._id}`}
              >
                {props.post.title}
                {solution ? '-[Résolu]' : ''}{' '}
                {props.post.course ? (
                  <span style={{ color: 'grey' }}>
                    {'#' + props.post.course}
                  </span>
                ) : (
                  ''
                )}
              </Link>
            ) : (
              <span>
                {props.post.title}
                {solution ? '-[Résolu]' : ''}{' '}
                {props.post.course ? (
                  <span style={{ color: 'grey' }}>
                    {'#' + props.post.course}
                  </span>
                ) : (
                  ''
                )}
              </span>
            )}
          </h4>
        </b>
        {props.navigable ? <p>{props.post.body}</p> : <p>{props.post.body}</p>}
        {user &&
          (props.admin || props.post.author._id === user._id) &&
          props.onDelete && (
            <button
              onClick={() => props.onDelete(props.post._id)}
              className="btn btn-danger"
            >
              supprimer
            </button>
          )}
        {props.type === 'response' && props.postAuthor._id === user._id && (
          <button
            onClick={() => props.onSolve(props.post._id)}
            className={`btn ${
              props.post.solution ? 'btn-success' : 'btn-primary'
            }
              `}
          >
            <i className="fas fa-check " />
          </button>
        )}
      </div>
    </div>
  );
};

export default post;
