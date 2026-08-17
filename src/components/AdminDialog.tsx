import { forwardRef, useState, type FormEvent } from "react";

interface AdminDialogProps {
  onSubmit: (password: string) => boolean; // return true if the password was correct
  onCancel: () => void;
}

const AdminDialog = forwardRef<HTMLDialogElement, AdminDialogProps>(
  ({ onSubmit, onCancel }, ref) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      const correct = onSubmit(password);
      if (correct) {
        setPassword("");
        setError("");
        setShowPassword(false);
      } else {
        setError("Incorrect password.");
      }
    }

    function handleCancel() {
      setPassword("");
      setError("");
      setShowPassword(false);
      onCancel();
    }

    return (
      <dialog
        ref={ref}
        className="fixed inset-0 m-auto p-0 border-none outline-none bg-transparent backdrop:bg-black/60 max-w-none max-h-none"
      >
        <div className="w-80 bg-surface border border-line rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold mb-1">Admin access</h3>
          <p className="text-sm text-muted mb-4">Enter the admin password to unlock results early.</p>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full bg-ink border border-line rounded-lg pl-4 pr-11 py-2.5 text-sm text-ivory placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-violet"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ivory transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {error && <p className="text-xs text-coral mt-2">{error}</p>}
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="flex-1 bg-violet text-ink font-semibold py-2 rounded-lg hover:brightness-110 transition"
              >
                Unlock
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-surface-raised text-ivory font-semibold py-2 rounded-lg hover:bg-line transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }
);

AdminDialog.displayName = "AdminDialog";

export default AdminDialog;