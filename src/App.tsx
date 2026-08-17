import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVotingState, submitVote, resetVotes } from "./api";
import { getVotesCastCount, getWinner } from "./logic";
import { VOTER_NAMES, CANDIDATE_NAMES, ADMIN_PASSWORD } from "./constants";
import Header from "./components/Header";
import VoterSearch from "./components/VoterSearch";
import VotingCard from "./components/VotingCard";
import ResultsPanel from "./components/ResultsPanel";
import VoteDialog from "./components/VoteDialog";
import AdminDialog from "./components/AdminDialog";

function App() {
  const queryClient = useQueryClient();

  const { data: state, isLoading, isError } = useQuery({
    queryKey: ["votingState"],
    queryFn: () => fetchVotingState(VOTER_NAMES, CANDIDATE_NAMES),
  });

  const [voterName, setVoterName] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [showStamp, setShowStamp] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const adminDialogRef = useRef<HTMLDialogElement>(null);

  const voteMutation = useMutation({
    mutationFn: ({ voterName, candidateName }: { voterName: string; candidateName: string }) =>
      submitVote(state!, voterName, candidateName),
  });

  const resetMutation = useMutation({
    mutationFn: () => resetVotes(VOTER_NAMES, CANDIDATE_NAMES),
    onSuccess: (freshState) => {
      queryClient.setQueryData(["votingState"], freshState);
    },
  });

  if (isLoading || !state) {
    return (
      <div className="min-h-screen bg-ink text-ivory flex items-center justify-center">
        <p className="font-mono text-sm text-muted">Loading voting data…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-ink text-ivory flex items-center justify-center">
        <p className="text-coral text-sm">Something went wrong loading the voting data.</p>
      </div>
    );
  }

  const totalVoters = VOTER_NAMES.length;
  const votesCast = getVotesCastCount(state);
  const allVotesIn = votesCast === totalVoters;
  const winnerText = getWinner(state);
  const progressPct = Math.round((votesCast / totalVoters) * 100);

  function handleRecordVoteClick() {
    if (!voterName || !candidateName) {
      alert("Select your name and a candidate before recording your vote.");
      return;
    }
    dialogRef.current?.showModal();
  }

  function handleConfirmVote() {
    voteMutation.mutate(
      { voterName, candidateName },
      {
        onSuccess: (result) => {
          if (!result.success) {
            alert(result.error);
            dialogRef.current?.close();
            return;
          }
          queryClient.setQueryData(["votingState"], result.state);
          setShowStamp(true);
          setTimeout(() => {
            setShowStamp(false);
            dialogRef.current?.close();
            setVoterName("");
            setCandidateName("");
          }, 800);
        },
      }
    );
  }

  function handleCancelVote() {
    dialogRef.current?.close();
  }

  function handleAdminSubmit(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      adminDialogRef.current?.close();
      return true;
    }
    return false;
  }

  function handleAdminCancel() {
    adminDialogRef.current?.close();
  }

  function resetVoting() {
    if (!confirm("Reset all votes? This can't be undone.")) return;
    resetMutation.mutate();
  }

  return (
    <div className="min-h-screen bg-ink font-body text-ivory relative">
      <button
        type="button"
        onClick={() => adminDialogRef.current?.showModal()}
        className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-surface border border-line rounded-full px-3 py-1.5 text-xs text-muted hover:text-gold hover:border-gold transition-colors cursor-pointer"
      >
        🔒 Admin
      </button>

      <Header totalVoters={totalVoters} votesCast={votesCast} progressPct={progressPct} />

      <VoterSearch key={votesCast} value={voterName} onSelect={setVoterName} />

      <VotingCard
        selected={candidateName}
        onSelect={setCandidateName}
        onRecordVote={handleRecordVoteClick}
      />

      <ResultsPanel
        state={state}
        votesCast={votesCast}
        allVotesIn={allVotesIn}
        isAdmin={isAdmin}
        winnerText={winnerText}
        onResetVotes={resetVoting}
        onExitAdmin={() => setIsAdmin(false)}
        isResetting={resetMutation.isPending}
      />

      <VoteDialog
        ref={dialogRef}
        voterName={voterName}
        candidateName={candidateName}
        showStamp={showStamp}
        isPending={voteMutation.isPending}
        onConfirm={handleConfirmVote}
        onCancel={handleCancelVote}
      />

      <AdminDialog ref={adminDialogRef} onSubmit={handleAdminSubmit} onCancel={handleAdminCancel} />
    </div>
  );
}

export default App;