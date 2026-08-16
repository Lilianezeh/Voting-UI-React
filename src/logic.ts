import type { VotingState, CastVoteResult } from "./types.js";

export function createInitialState(voterNames: string[], candidateNames: string[]): VotingState {
  return {
    voters: voterNames.map((name) => ({ name, hasVoted: false })),
    candidates: candidateNames.map((name) => ({ name, votes: 0 })),
  };
}

export function hasVoterVoted(state: VotingState, voterName: string): boolean {
  const voter = state.voters.find((v) => v.name === voterName);
  return voter ? voter.hasVoted : false;
}

export function castVote(
  state: VotingState,
  voterName: string,
  candidateName: string
): CastVoteResult {
  const voter = state.voters.find((v) => v.name === voterName);
  const candidate = state.candidates.find((c) => c.name === candidateName);

  if (!voter) {
    return { success: false, error: "Voter not found. Please select your name." };
  }
  if (!candidate) {
    return { success: false, error: "Candidate not found. Please select a candidate." };
  }
  if (voter.hasVoted) {
    return { success: false, error: `${voterName} has already voted.` };
  }

  const newState: VotingState = {
    voters: state.voters.map((v) =>
      v.name === voterName ? { ...v, hasVoted: true } : v
    ),
    candidates: state.candidates.map((c) =>
      c.name === candidateName ? { ...c, votes: c.votes + 1 } : c
    ),
  };

  return { success: true, state: newState };
}

export function getVotesCastCount(state: VotingState): number {
  return state.voters.filter((v) => v.hasVoted).length;
}

export function getWinner(state: VotingState): string {
  if (state.candidates.length === 0) return "No Winner Yet";

  const totalVotes = state.candidates.reduce((sum, c) => sum + c.votes, 0);
  if (totalVotes === 0) return "No Winner Yet";

  const sorted = [...state.candidates].sort((a, b) => b.votes - a.votes);
  const top = sorted[0];
  if (!top) return "No Winner Yet";

  const second = sorted[1];
  const isTie = second !== undefined && second.votes === top.votes;

  if (isTie) return "It's a Tie!";
  return `${top.name} is Winning`;
}

export function isVotingComplete(state: VotingState): boolean {
  return state.voters.every((v) => v.hasVoted);
}