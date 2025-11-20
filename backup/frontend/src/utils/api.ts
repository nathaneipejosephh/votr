import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Types
export type Contestant = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  competitionId: string;
  createdAt: string;
};

export type VoteRanking = {
  id: string;
  voteId: string;
  contestantId: string;
  rank: number;
  points: number;
};

export type Vote = {
  id: string;
  voterId: string;
  competitionId: string;
  rankings: VoteRanking[];
  createdAt: string;
};

export type Competition = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  contestants: Contestant[];
  _count?: {
    votes: number;
  };
};

export type ContestantResult = Contestant & {
  totalPoints: number;
  voteCount: number;
  rankCounts: { [key: number]: number };
  averagePoints: number;
  position: number;
};

export type ResultData = {
  competitionId: string;
  totalVotes: number;
  results: ContestantResult[];
};

export const api = {
  // Competitions
  getCompetitions: () => axios.get<Competition[]>(`${API_URL}/competitions`),
  getCompetition: (id: string) => axios.get<Competition>(`${API_URL}/competitions/${id}`),
  createCompetition: (data: { title: string; description?: string }) =>
    axios.post<Competition>(`${API_URL}/competitions`, data),
  updateCompetition: (id: string, data: Partial<Competition>) =>
    axios.put<Competition>(`${API_URL}/competitions/${id}`, data),
  deleteCompetition: (id: string) => axios.delete(`${API_URL}/competitions/${id}`),

  // Contestants
  getContestants: (competitionId: string) =>
    axios.get<Contestant[]>(`${API_URL}/contestants/competition/${competitionId}`),
  createContestant: (data: { name: string; description?: string; imageUrl?: string; competitionId: string }) =>
    axios.post<Contestant>(`${API_URL}/contestants`, data),
  updateContestant: (id: string, data: Partial<Contestant>) =>
    axios.put<Contestant>(`${API_URL}/contestants/${id}`, data),
  deleteContestant: (id: string) => axios.delete(`${API_URL}/contestants/${id}`),

  // Votes
  submitVote: (data: { voterId: string; competitionId: string; rankings: string[] }) =>
    axios.post<Vote>(`${API_URL}/votes`, data),
  checkVote: (competitionId: string, voterId: string) =>
    axios.get<{ hasVoted: boolean }>(`${API_URL}/votes/check/${competitionId}/${voterId}`),

  // Results
  getResults: (competitionId: string) => axios.get<ResultData>(`${API_URL}/results/${competitionId}`),
};
