import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const employeeService = {
  listEmployees: () => api.get('/employees'),
  getEmployee: (id) => api.get(`/employees/${id}`),
  createEmployee: (data) => api.post('/employees', data),
  updateEmployee: (id, data) => api.put(`/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
};

export const teamService = {
  listTeams: () => api.get('/teams'),
  getTeam: (id) => api.get(`/teams/${id}`),
  createTeam: (data) => api.post('/teams', data),
  updateTeam: (id, data) => api.put(`/teams/${id}`, data),
  deleteTeam: (id) => api.delete(`/teams/${id}`),
  assignEmployee: (teamId, data) => api.post(`/teams/${teamId}/assign`, data),
  unassignEmployee: (teamId, data) => api.post(`/teams/${teamId}/unassign`, data),
};

export const logService = {
  getLogs: (params) => api.get('/logs', { params }),
};

export default api;
