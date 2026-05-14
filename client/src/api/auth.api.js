/**
 * api/auth.api.js — Authentication API calls
 */

import api from './axios'

export const authAPI = {
  signup:        (data) => api.post('/auth/signup', data),
  login:         (data) => api.post('/auth/login', data),
  getMe:         ()     => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
}
