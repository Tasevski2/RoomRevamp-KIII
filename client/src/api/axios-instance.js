import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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
