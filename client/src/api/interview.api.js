/**
 * api/interview.api.js — Interview API calls
 */

import api from './axios'

export const interviewAPI = {
  start:   (data)       => api.post('/interview/start', data),
  submit:  (data)       => api.post('/interview/submit', data),
  getById: (id)         => api.get(`/interview/${id}`),
}

export const historyAPI = {
  getHistory: (params) => api.get('/history', { params }),
  getStats:   ()       => api.get('/history/stats'),
  delete:     (id)     => api.delete(`/history/${id}`),
}
