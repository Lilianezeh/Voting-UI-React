import { useEffect, useRef, useState, type FormEvent } from "react";
import type { VotingState } from "./types";
import { createInitialState, castVote, getVotesCastCount, getWinner } from "./logic";

const VOTER_NAMES = [
  "Austin", "Lilian", "Majesty", "Chidimma", "Ifeanyi", "Stephanie", "Rita",
  "Christopher", "Bonaventure", "Victor", "Amarachi", "Charles", "Abigail",
  "Loveth", "James", "David", "Anthony", "Kosisochukwu", "Gabriel", "Peter",
];
const CANDIDATE_NAMES = ["Kosisochukwu", "Austin", "Lilian", "Ifeanyi", "Victor", "Amara"];
const AVATAR_COLORS = ["#F5B700", "#12B886", "#FF5D5D", "#8B5CF6"];

// Admin Password to view the votes

const ADMIN_PASSWORD = "Admin@1234";

function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

function App() {
  const [state, setState] = useState<VotingState>(() =>
    createInitialState(VOTER_NAMES, CANDIDATE_NAMES)
  );

  const [voterQuery, setVoterQuery] = useState("");
  const [voterName, setVoterName] = useState("");
  const [isVoterListOpen, setIsVoterListOpen] = useState(false);
  const voterBoxRef = useRef<HTMLDivElement>(null);

  const [candidateName, setCandidateName] = useState("");
  const [showStamp, setShowStamp] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const adminDialogRef = useRef<HTMLDialogElement>(null);

  const totalVoters = VOTER_NAMES.length;
  const votesCast = getVotesCastCount(state);
  const allVotesIn = votesCast === totalVoters;
  const maxVotes = Math.max(...state.candidates.map((c) => c.votes));
  const winnerText = getWinner(state);
  const progressPct = Math.round((votesCast / totalVoters) * 100);

  const filteredVoters = VOTER_NAMES.filter((name) =>
    name.toLowerCase().includes(voterQuery.toLowerCase())
  );

  // Close voter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (voterBoxRef.current && !voterBoxRef.current.contains(e.target as Node)) {
        setIsVoterListOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleVoterInputChange(value: string) {
    setVoterQuery(value);
    setVoterName(""); // require an explicit pick from the list
    setIsVoterListOpen(true);
  }

  function selectVoter(name: string) {
    setVoterName(name);
    setVoterQuery(name);
    setIsVoterListOpen(false);
  }

  function handleRecordVoteClick() {
    if (!voterName || !candidateName) {
      alert("Select your name and a candidate before recording your vote.");
      return;
    }
    dialogRef.current?.showModal();
  }

  function handleConfirmVote() {
    const result = castVote(state, voterName, candidateName);

    if (!result.success) {
      alert(result.error);
      dialogRef.current?.close();
      return;
    }

    setState(result.state);
    setShowStamp(true);

    setTimeout(() => {
      setShowStamp(false);
      dialogRef.current?.close();
      setVoterName("");
      setVoterQuery("");
      setCandidateName("");
    }, 800);
  }

  function handleCancelVote() {
    dialogRef.current?.close();
  }

  function openAdminDialog() {
    setAdminPasswordInput("");
    setAdminError("");
    setShowAdminPassword(false);
    adminDialogRef.current?.showModal();
  }

  function handleAdminSubmit(e: FormEvent) {
    e.preventDefault();
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminError("");
      setShowAdminPassword(false);
      adminDialogRef.current?.close();
    } else {
      setAdminError("Incorrect password.");
    }
  }

  function handleAdminCancel() {
    setAdminPasswordInput("");
    setAdminError("");
    setShowAdminPassword(false);
    adminDialogRef.current?.close();
  }

  function exitAdminMode() {
    setIsAdmin(false);
  }

  const showResults = allVotesIn || isAdmin;

  return (
    <div className="min-h-screen bg-ink font-body text-ivory relative">
      {/* Admin trigger */}
      <button
        type="button"
        onClick={openAdminDialog}
        className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-surface border border-line rounded-full px-3 py-1.5 text-xs text-muted hover:text-gold hover:border-gold transition-colors cursor-pointer"
      >
        🔒 Admin
      </button>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-3">
          Official Ballot
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold">Head of House</h1>
        <p className="text-muted mt-2">HackathonAfrica 3.0 · General Election</p>

        <div className="mt-8 flex items-center justify-center gap-8 font-mono text-sm text-muted">
          <div>
            <span className="text-ivory text-lg font-semibold">{totalVoters}</span> members
          </div>
          <div className="w-px h-8 bg-line" />
          <div>
            <span className="text-gold text-lg font-semibold">{votesCast}</span>/{totalVoters} votes cast
          </div>
        </div>

        <div className="mt-4 max-w-xs mx-auto h-2 rounded-full bg-surface-raised overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Voter search */}
      <div className="max-w-md mx-auto px-6">
        <div className="bg-surface border border-line rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold mb-1">Find your name</h2>
          <p className="text-sm text-muted mb-4">Search the voter roll to identify yourself.</p>

          <div ref={voterBoxRef} className="relative">
            <input
              type="text"
              value={voterQuery}
              onChange={(e) => handleVoterInputChange(e.target.value)}
              onFocus={() => setIsVoterListOpen(true)}
              placeholder="Start typing a name…"
              className="w-full bg-ink border border-line rounded-lg px-4 py-2.5 text-sm text-ivory placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {isVoterListOpen && (
              <div className="absolute z-10 mt-2 w-full max-h-56 overflow-y-auto bg-surface-raised border border-line rounded-lg shadow-xl">
                {filteredVoters.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted">No matching names.</p>
                ) : (
                  filteredVoters.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => selectVoter(name)}
                      className="w-full text-left px-4 py-2.5 text-sm text-ivory hover:bg-ink transition-colors"
                    >
                      {name}
                    </button>
                  ))
                )}
              </div>
            )}
            {voterName && <p className="mt-2 text-xs text-teal">Signed in as {voterName}</p>}
          </div>
        </div>
      </div>

      {/* Candidate grid */}
      <div className="max-w-2xl mx-auto px-6 mt-8">
        <div className="bg-surface border border-line rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold mb-1 text-center">Cast your vote</h2>
          <p className="text-sm text-muted mb-6 text-center">Choose a nominated candidate.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CANDIDATE_NAMES.map((name, i) => {
              const isSelected = candidateName === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCandidateName(name)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-gold ${
                    isSelected ? "border-gold bg-ink ring-2 ring-gold" : "border-line bg-ink hover:border-muted"
                  }`}
                >
                  <span
                    className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-ink text-lg"
                    style={{ backgroundColor: getAvatarColor(i) }}
                  >
                    {getInitials(name)}
                  </span>
                  <span className="text-sm text-ivory">{name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleRecordVoteClick}
              className="bg-gold text-ink font-display font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-surface"
            >
              Record Vote
            </button>
          </div>
        </div>
      </div>

      {/* Results — sealed until all votes are in, or unlocked early by admin */}
      <div className="max-w-2xl mx-auto px-6 mt-8 mb-16">
        <div className="bg-surface border border-line rounded-2xl p-6">
          {isAdmin && !allVotesIn && (
            <div className="flex items-center justify-between bg-violet/10 border border-violet rounded-lg px-4 py-2 mb-4">
              <span className="text-xs text-violet font-medium">
                Admin view — results unlocked early
              </span>
              <button
                type="button"
                onClick={exitAdminMode}
                className="text-xs text-muted hover:text-ivory underline"
              >
                Exit admin
              </button>
            </div>
          )}

          {!showResults ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-surface-raised flex items-center justify-center mb-3 text-xl">
                🔒
              </div>
              <h2 className="font-display text-lg font-semibold mb-1">Results sealed</h2>
              <p className="text-sm text-muted">
                Tallies unlock once all {totalVoters} votes are in — {totalVoters - votesCast} to go.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="font-display text-lg font-semibold mb-4 text-center">Final Tally</h2>
              <div className="space-y-3">
                {[...state.candidates]
                  .sort((a, b) => b.votes - a.votes)
                  .map((candidate) => {
                    const pct = votesCast === 0 ? 0 : Math.round((candidate.votes / votesCast) * 100);
                    const isLeading = candidate.votes === maxVotes && maxVotes > 0;
                    return (
                      <div key={candidate.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm ${isLeading ? "text-gold font-semibold" : "text-ivory"}`}>
                            {candidate.name}
                          </span>
                          <span className="font-mono text-sm text-muted">{candidate.votes} votes</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-raised overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isLeading ? "bg-gold" : "bg-line"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <p className="text-center font-display text-xl font-bold text-gold mt-6">{winnerText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation dialog */}
      <dialog
        ref={dialogRef}
        className="fixed inset-0 m-auto p-0 border-none outline-none bg-transparent backdrop:bg-black/60 max-w-none max-h-none"
      >
        <div className="w-80 sm:w-96 bg-surface border border-line rounded-2xl p-6">
          {showStamp ? (
            <div className="py-10 flex flex-col items-center justify-center">
              <div className="animate-stamp border-4 border-coral text-coral font-display font-bold text-xl px-6 py-2 rounded-md">
                VOTE RECORDED
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-display text-lg font-semibold mb-1">Confirm your vote</h3>
              <p className="text-sm text-muted mb-6">
                You're voting for <span className="text-gold font-medium">{candidateName}</span> as{" "}
                {voterName}. This can't be changed once submitted.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleConfirmVote}
                  className="flex-1 bg-gold text-ink font-semibold py-2 rounded-lg hover:brightness-110 transition"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={handleCancelVote}
                  className="flex-1 bg-surface-raised text-ivory font-semibold py-2 rounded-lg hover:bg-line transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>

      {/* Admin login dialog */}
      <dialog
        ref={adminDialogRef}
        className="fixed inset-0 m-auto p-0 border-none outline-none bg-transparent backdrop:bg-black/60 max-w-none max-h-none"
      >
        <div className="w-80 bg-surface border border-line rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold mb-1">Admin access</h3>
          <p className="text-sm text-muted mb-4">
            Enter the admin password to unlock results early.
          </p>
          <form onSubmit={handleAdminSubmit}>
            <div className="relative">
              <input
                type={showAdminPassword ? "text" : "password"}
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full bg-ink border border-line rounded-lg pl-4 pr-11 py-2.5 text-sm text-ivory placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-violet"
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ivory transition-colors"
                aria-label={showAdminPassword ? "Hide password" : "Show password"}
              >
                {showAdminPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {adminError && <p className="text-xs text-coral mt-2">{adminError}</p>}
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="flex-1 bg-violet text-ink font-semibold py-2 rounded-lg hover:brightness-110 transition"
              >
                Unlock
              </button>
              <button
                type="button"
                onClick={handleAdminCancel}
                className="flex-1 bg-surface-raised text-ivory font-semibold py-2 rounded-lg hover:bg-line transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default App;