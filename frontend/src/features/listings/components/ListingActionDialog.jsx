
import {
  AlertTriangle,
  CheckCircle2,
  CircleX,
  PackageCheck,
  X,
} from "lucide-react";

const actionDetails = {
  cancel: {
    title: "Cancel this listing?",
    description:
      "The auction will stop accepting bids and be removed from the active marketplace. Listings with bids cannot be cancelled.",
    confirmLabel: "Cancel listing",
    confirmClass: "bg-red-600 hover:bg-red-700",
    Icon: AlertTriangle,
  },
  cancel_sale: {
    title: "Cancel this reserved sale?",
    description:
      "The reservation will end and the item will no longer be marked as reserved for the winner.",
    confirmLabel: "Cancel reserved sale",
    confirmClass: "bg-red-600 hover:bg-red-700",
    Icon: AlertTriangle,
  },
  approve: {
    title: "Approve the winning bid?",
    description:
      "This reserves the item for the highest bidder. Record the campus handover after pickup.",
    confirmLabel: "Approve and reserve",
    confirmClass: "bg-indigo-600 hover:bg-indigo-700",
    Icon: CheckCircle2,
  },
  reject: {
    title: "Reject the winning bid?",
    description:
      "The auction will be recorded as rejected and the item will not be reserved for the winner.",
    confirmLabel: "Reject winning bid",
    confirmClass: "bg-red-600 hover:bg-red-700",
    Icon: CircleX,
  },
  complete: {
    title: "Confirm the campus handover?",
    description:
      "Only confirm this after the item has been handed to the winner. This marks the auction as sold.",
    confirmLabel: "Confirm handover",
    confirmClass: "bg-emerald-600 hover:bg-emerald-700",
    Icon: PackageCheck,
  },
  failed_pickup: {
    title: "Record a failed pickup?",
    description:
      "Use this when the reserved winner did not complete the campus pickup.",
    confirmLabel: "Record failed pickup",
    confirmClass: "bg-amber-600 hover:bg-amber-700",
    Icon: AlertTriangle,
  },
};

export default function ListingActionDialog({
  listing,
  action,
  onCancel,
  onConfirm,
  isLoading,
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
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <X size={16} />
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${config.confirmClass}`}
          >
            {isLoading ? "Saving..." : config.confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
