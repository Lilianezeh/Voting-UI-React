interface HeaderProps {
  totalVoters: number;
  votesCast: number;
  progressPct: number;
}

function Header({ totalVoters, votesCast, progressPct }: HeaderProps) {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
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
  );
}

export default Header;