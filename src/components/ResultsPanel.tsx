import type { VotingState } from "../types";

interface ResultsPanelProps {
  state: VotingState;
  votesCast: number;
  allVotesIn: boolean;
  isAdmin: boolean;
  winnerText: string;
  onResetVotes: () => void;
  onExitAdmin: () => void;
  isResetting: boolean;
}

function ResultsPanel({
  state,
  votesCast,
  allVotesIn,
  isAdmin,
  winnerText,
  onResetVotes,
  onExitAdmin,
  isResetting,
}: ResultsPanelProps) {
  const maxVotes = Math.max(...state.candidates.map((c) => c.votes));
  const showResults = allVotesIn || isAdmin;

  return (
    <div className="max-w-2xl mx-auto px-6 mt-8 mb-16">
      <div className="bg-surface border border-line rounded-2xl p-6">
        {isAdmin && (
          <div className="flex items-center justify-between flex-wrap gap-2 bg-violet/10 border border-violet rounded-lg px-4 py-2 mb-4">
            <span className="text-xs text-violet font-medium">
              {allVotesIn ? "Admin tools" : "Admin view — results unlocked early"}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onResetVotes}
                disabled={isResetting}
                className="text-xs text-coral hover:text-ivory underline disabled:opacity-50"
              >
                {isResetting ? "Resetting…" : "Reset votes"}
              </button>
              <button
                type="button"
                onClick={onExitAdmin}
                className="text-xs text-muted hover:text-ivory underline"
              >
                Exit admin
              </button>
            </div>
          </div>
        )}

        {!showResults ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto rounded-full bg-surface-raised flex items-center justify-center mb-3 text-xl">
              🔒
            </div>
            <h2 className="font-display text-lg font-semibold mb-1">Results sealed</h2>
            <p className="text-sm text-muted">Results will be reviewed once voting is complete.</p>
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
  );
}

export default ResultsPanel;