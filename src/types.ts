export interface Voter {
    name: string;
    hasVoted: boolean;
}

export interface Candidate {
    name: string;
    votes: number;
}

export interface VotingState {
    voters: Voter[];
    candidates: Candidate[]
}

export type CastVoteResult =
| { success: true; state: VotingState }
| { success: false; error: string };