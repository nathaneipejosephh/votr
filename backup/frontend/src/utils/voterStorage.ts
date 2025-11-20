import { v4 as uuidv4 } from 'uuid';

const VOTER_ID_KEY = 'votr_voter_id';

export const getVoterId = (): string => {
  let voterId = localStorage.getItem(VOTER_ID_KEY);

  if (!voterId) {
    voterId = uuidv4();
    localStorage.setItem(VOTER_ID_KEY, voterId);
  }

  return voterId;
};

export const clearVoterId = (): void => {
  localStorage.removeItem(VOTER_ID_KEY);
};
