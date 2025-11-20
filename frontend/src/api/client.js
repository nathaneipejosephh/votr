import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Configure axios defaults
axios.defaults.withCredentials = true;

export const api = {
  // Competitions
  getCompetitions: () => axios.get(`${API_URL}/competitions`),
  getCompetition: (id) => axios.get(`${API_URL}/competitions/${id}`),
  getCompetitionByCode: (code) => axios.get(`${API_URL}/competitions/code/${code}`),
  createCompetition: (data) => axios.post(`${API_URL}/competitions`, data),
  updateCompetition: (id, data) => axios.put(`${API_URL}/competitions/${id}`, data),
  deleteCompetition: (id) => axios.delete(`${API_URL}/competitions/${id}`),
  publishCompetition: (id) => axios.post(`${API_URL}/competitions/${id}/publish`),
  unpublishCompetition: (id) => axios.post(`${API_URL}/competitions/${id}/unpublish`),

  // Contestants
  getContestants: (competitionId) => axios.get(`${API_URL}/contestants/competition/${competitionId}`),
  createContestant: (data) => axios.post(`${API_URL}/contestants`, data),
  updateContestant: (id, data) => axios.put(`${API_URL}/contestants/${id}`, data),
  deleteContestant: (id) => axios.delete(`${API_URL}/contestants/${id}`),

  // Votes
  submitVote: (data) => axios.post(`${API_URL}/votes`, data),
  checkVote: (competitionId, voterId) =>
    axios.get(`${API_URL}/votes/check/${competitionId}/${voterId}`),

  // Results
  getResults: (competitionId) => axios.get(`${API_URL}/results/${competitionId}`),

  // Auth
  getMe: () => axios.get(`${API_URL}/auth/me`),
  logout: () => axios.post(`${API_URL}/auth/logout`),
};

// Voter ID management
const VOTER_ID_KEY = 'votr_voter_id';

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getVoterId() {
  let voterId = localStorage.getItem(VOTER_ID_KEY);
  if (!voterId) {
    voterId = generateId();
    localStorage.setItem(VOTER_ID_KEY, voterId);
  }
  return voterId;
}
