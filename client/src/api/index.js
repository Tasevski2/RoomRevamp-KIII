import axiosInstance from './axios-instance';

// AUTH
const register = (userData) => axiosInstance.post('/auth/register', userData);
const login = (credentials) => axiosInstance.post('/auth/login', credentials);
const logout = () => axiosInstance.get('/auth/logout');
const checkJwt = () => axiosInstance.get('/auth/check-jwt');

const forgotPassword = (email) =>
  axiosInstance.post('/forgot-password', { email });

// USER
const getMe = () => axiosInstance.get('/user/me');
const changePassword = (passwords) =>
  axiosInstance.post('/user/change-password', passwords);

// PROJECT
const getMyProjects = () => axiosInstance.get('/project/my-projects');
const getProjectWithModels = (id) => axiosInstance.get(`/project/${id}`);
const createProject = (projectName) =>
  axiosInstance.post('/project', { name: projectName });
const updateProject = (id, projectData) =>
  axiosInstance.post(`/project/${id}`, projectData);
const updateProjectModels = (projectId, modelsData) =>
  axiosInstance.post(`/project/${projectId}/models`, { models: modelsData });
const deleteProject = (id) => axiosInstance.delete(`/project/${id}`);

// MODELS 3D

const getMyModels3D = () => axiosInstance.get('/model3D/my-models3D');
const getAvailableModels3D = () => axiosInstance.get('/model3D/available');
const createModel3D = (model3DData) =>
  axiosInstance.post('/model3D', model3DData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
const updateModel3D = (id, model3DFormData) =>
  axiosInstance.post(`/model3D/${id}`, model3DFormData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
const deleteModel3D = (id) => axiosInstance.delete(`/model3D/${id}`);

// MEDIA
const getImage = (src) =>
  axiosInstance.get(`/image?src=${encodeURIComponent(src)}`, {
    responseType: 'blob',
  });
const getModel3D = (src) =>
  axiosInstance.get(`/model3D?src=${encodeURIComponent(src)}`, {
    responseType: 'arraybuffer',
  });

export const API = {
  register,
  login,
  logout,
  checkJwt,
  forgotPassword,
  getMe,
  changePassword,
  getMyProjects,
  getProjectWithModels,
  createProject,
  updateProject,
  updateProjectModels,
  deleteProject,
  getMyModels3D,
  getAvailableModels3D,
  createModel3D,
  updateModel3D,
  deleteModel3D,
  getImage,
  getModel3D,
};
