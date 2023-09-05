import axios from 'axios';

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? window.env.REACT_APP_API_URL
    : process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: apiUrl,
  headers: {
    post: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    put: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    delete: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});

export const setAuthHeader = (jwt = '') => {
  instance.defaults.headers.common['Authorization'] = 'Bearer ' + jwt;
};

export default instance;
