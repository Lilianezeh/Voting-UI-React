import { forwardRef } from "react";

interface VoteDialogProps {
  voterName: string;
  candidateName: string;
  showStamp: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const VoteDialog = forwardRef<HTMLDialogElement, VoteDialogProps>(
  ({ voterName, candidateName, showStamp, isPending, onConfirm, onCancel }, ref) => {
    return (
      <dialog
        ref={ref}
        className="fixed inset-0 m-auto p-0 border-none outline-none bg-transparent backdrop:bg-black/60 max-w-none max-h-none"
      >
        <div className="w-80 sm:w-96 bg-surface border border-line rounded-2xl p-6">
          {showStamp ? (
            <div className="py-10 flex flex-col items-center justify-center">
              <div className="animate-stamp border-4 border-teal text-teal font-display font-bold text-xl px-6 py-2 rounded-md">
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
                  onClick={onConfirm}
                  disabled={isPending}
                  className="flex-1 bg-gold text-ink font-semibold py-2 rounded-lg hover:brightness-110 transition disabled:opacity-50"
                >
                  {isPending ? "Recording…" : "Confirm"}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-surface-raised text-ivory font-semibold py-2 rounded-lg hover:bg-line transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>
    );
  }
);

VoteDialog.displayName = "VoteDialog";

export default VoteDialog;