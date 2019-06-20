import React from 'react';

const userInfo = ({ user, onFollow, alreadySub }) => {
  let currentUser = JSON.parse(localStorage.getItem('currentUser'));
  console.log(user.notes);
  let moyenneNotes = 0;
  if (user.notes.length !== 0) {
    let totalNotes = 0;
    for (let i = 0; i < user.notes.length; i++) {
      totalNotes += parseInt(user.notes[i]);
    }
    moyenneNotes = totalNotes / user.notes.length;
  }

  return (
    <div className='card border-primary mb-3'>
      <div className='card-header'>
        {user.name}
        {'   '}
        {user._id !== currentUser._id && !alreadySub && (
          <button
            onClick={() => onFollow(user._id)}
            className='btn btn-primary'
          >
            Suivre
          </button>
        )}
        {alreadySub && (
          <button className='btn btn-danger'> Ne plus suivre </button>
        )}
      </div>
      <div className='card-body '>
        <div className='bio'>
          <h5>Bio </h5>
          <div>
            <span>{user.bio}</span>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div className='tile tile-note'>
            <h5>Note reçu en moyenne</h5>
            <div>
              <span>{user.notes.length === 0 ? '---' : moyenneNotes}</span>
            </div>
          </div>
          <div className='tile tile-aide'>
            <h5>Points solutions</h5>
            <div>
              <span>{user.points}</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div className='tile tile-contact'>
            <h5>Contact</h5>
            <div>
              <span>{user.contact}</span>
            </div>
          </div>
          <div className='tile tile-email'>
            <h5>Email</h5>
            <div>
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default userInfo;
