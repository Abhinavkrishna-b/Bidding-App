
import { AlertTriangle, CheckCircle2, Trash2, X } from "lucide-react";

const actionDetails = {
  end: {
    title: "End this auction?",
    description:
      "This will mark the listing as ended in this prototype. It will not determine a real winner or cancel server-side bidding.",
    confirmLabel: "End auction",
    confirmClass: "bg-amber-600 hover:bg-amber-700",
    Icon: AlertTriangle,
  },
  delete: {
    title: "Remove this listing record?",
    description:
      "The listing will disappear from this prototype's management view. This action cannot be undone here.",
    confirmLabel: "Remove record",
    confirmClass: "bg-red-600 hover:bg-red-700",
    Icon: Trash2,
  },
  publish: {
    title: "Publish this draft?",
    description:
      "This will mark the draft as active in the prototype. It will not create a real public auction on the server.",
    confirmLabel: "Publish demo",
    confirmClass: "bg-indigo-600 hover:bg-indigo-700",
    Icon: CheckCircle2,
  },
};

export default function ListingActionDialog({
  listing,
  action,
  onCancel,
  onConfirm,
}) {
  if (!listing || !action) return null;

  const config = actionDetails[action];

  if (!config) return null;

  const { Icon } = config;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="listing-action-title"
        aria-describedby="listing-action-description"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon size={23} />
        </div>

        <h2
          id="listing-action-title"
          className="mt-5 text-xl font-bold text-slate-900"
        >
          {config.title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          <span className="font-semibold text-slate-700">
            {listing.title}
          </span>
          {" — "}
          <span id="listing-action-description">
            {config.description}
          </span>
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <X size={16} />
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${config.confirmClass}`}
          >
            {config.confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
