import { useEffect, useRef, useState } from "react";
import { VOTER_NAMES } from "../constants";

interface VoterSearchProps {
  value: string;
  onSelect: (name: string) => void;
}

function VoterSearch({ value, onSelect }: VoterSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = VOTER_NAMES.filter((name) =>
    name.toLowerCase().includes(query.toLowerCase())
  );

  function handleChange(newValue: string) {
    setQuery(newValue);
    onSelect(""); // typing clears any previously confirmed selection
    setIsOpen(true);
  }

  function handleSelect(name: string) {
    onSelect(name);
    setQuery(name);
    setIsOpen(false);
  }

  return (
    <div className="max-w-md mx-auto px-6">
      <div className="bg-surface border border-line rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold mb-1">Find your name</h2>
        <p className="text-sm text-muted mb-4">Search the voter roll to identify yourself.</p>

        <div ref={boxRef} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Start typing a name…"
            className="w-full bg-ink border border-line rounded-lg px-4 py-2.5 text-sm text-ivory placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold"
          />
          {isOpen && (
            <div className="absolute z-10 mt-2 w-full max-h-56 overflow-y-auto bg-surface-raised border border-line rounded-lg shadow-xl">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-sm text-muted">No matching names.</p>
              ) : (
                filtered.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSelect(name)}
                    className="w-full text-left px-4 py-2.5 text-sm text-ivory hover:bg-ink transition-colors"
                  >
                    {name}
                  </button>
                ))
              )}
            </div>
          )}
          {value && <p className="mt-2 text-xs text-teal">Signed in as {value}</p>}
        </div>
      </div>
    </div>
  );
}

export default VoterSearch;