// Base types
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
