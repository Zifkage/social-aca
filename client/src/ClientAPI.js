import axios from 'axios';

const getUserId = () => {
  return JSON.parse(localStorage.getItem('currentUser'))._id;
};

const tokenHeader = () => {
  return {
    headers: { token: getUserId() }
  };
};

const ax = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000
});

// AUTH
export const logout = () => {
  return ax.post('/logout', {}, tokenHeader());
};

export const login = data => {
  return ax.post('/login', data);
};

// POST
export const createPost = data => {
  return ax.post('/posts', data, tokenHeader());
};

export const getPostsList = () => {
  return ax.get('/posts');
};

export const getPost = postId => {
  return ax.get(`/posts/${postId}`);
};

export const deletePost = postId => {
  return ax.delete(`/posts?postId=${postId}`);
};

export const votePost = (postId, data) => {
  return ax.post(`/posts/${postId}/vote`, data, tokenHeader());
};

export const solvePost = (postId, responseId) => {
  return ax.patch(
    `/posts/${postId}/${responseId}/solve`,
    {},
    { ...tokenHeader() }
  );
};

// RESPONSE
export const createResponse = (postId, data) => {
  return ax.post(`/responses/${postId}`, data, tokenHeader());
};

export const voteResponse = (postId, responseId, data) => {
  return ax.post(
    `/responses/${postId}/${responseId}/vote`,
    data,
    tokenHeader()
  );
};

// WORKSHOP
export const createWorkshop = data => {
  return ax.post('/workshops', data, tokenHeader());
};

export const getWorkshop = workshopId => {
  return ax.get(`/workshops/${workshopId}`);
};

export const getWorshopsList = () => {
  return ax.get('/workshops');
};

export const participateWorkshop = workshopId => {
  return ax.patch(`/workshops/${workshopId}/participate`, {}, tokenHeader());
};

// USER

export const getUser = userId => {
  return ax.get(`/users/${userId}`);
};

export const createUser = data => {
  return ax.post('/users/', data);
};

export const followUser = userId => {
  return ax.post(`/users/follow/${userId}`, {}, tokenHeader());
};

// Notification

export const getNotifications = userId => {
  return ax.get(`/notifications/${userId}`, {}, tokenHeader());
};

export const trackcourses = (userId, courses) => {
  return ax.post(`/trackcourses/${userId}`, { courses }, tokenHeader());
};

export const getTrackcourses = userId => {
  return ax.get(`/trackcourses/${userId}`, {}, tokenHeader());
};
