import type { VotingState, CastVoteResult } from "./types";
import { castVote as castVoteLogic, createInitialState } from "./logic";

const STORAGE_KEY = "voting-ui-state";

// Reads the voting state from localStorage.
// Still async (returns a Promise) so it works with useQuery,
// but there's no artificial delay — this is real localStorage, not a fake server.
export async function fetchVotingState(
  voterNames: string[],
  candidateNames: string[]
): Promise<VotingState> {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved) as VotingState;
    } catch {
      return createInitialState(voterNames, candidateNames);
    }
  }
  return createInitialState(voterNames, candidateNames);
}

export async function submitVote(
  currentState: VotingState,
  voterName: string,
  candidateName: string
): Promise<CastVoteResult> {
  const result = castVoteLogic(currentState, voterName, candidateName);
  if (result.success) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.state));
  }
  return result;
}

export async function resetVotes(
  voterNames: string[],
  candidateNames: string[]
): Promise<VotingState> {
  const fresh = createInitialState(voterNames, candidateNames);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}