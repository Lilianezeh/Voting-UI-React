import { CANDIDATE_NAMES } from "../constants";
import { getAvatarColor, getInitials } from "../utils";

interface VotingCardProps {
  selected: string;
  onSelect: (name: string) => void;
  onRecordVote: () => void;
}

function VotingCard({ selected, onSelect, onRecordVote }: VotingCardProps) {
  return (
    <div className="max-w-2xl mx-auto px-6 mt-8">
      <div className="bg-surface border border-line rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold mb-1 text-center">Cast your vote</h2>
        <p className="text-sm text-muted mb-6 text-center">Choose a nominated candidate.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CANDIDATE_NAMES.map((name, i) => {
            const isSelected = selected === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => onSelect(name)}
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
            onClick={onRecordVote}
            className="bg-gold text-ink font-display font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-surface"
          >
            Record Vote
          </button>
        </div>
      </div>
    </div>
  );
}

export default VotingCard;