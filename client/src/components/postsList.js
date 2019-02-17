import React from 'react';
import Post from './post';

const postsList = (props) => {
  return (
    <div>
      {props.posts.map((p) => (
        <Post navigable={props.postNavigable} key={p._id} post={p} />
      ))}
    </div>
  );
};

export default postsList;