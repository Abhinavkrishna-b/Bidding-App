
import { ArrowUpRight, Clock3, Gavel } from "lucide-react";
import { Link } from "react-router-dom";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTimeRemaining(endsAt) {
  const remaining = new Date(endsAt).getTime() - Date.now();

  if (!Number.isFinite(remaining) || remaining <= 0) {
    return "Auction ended";
  }

  const hours = Math.floor(remaining / 3_600_000);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h left`;
  if (hours > 0) return `${hours}h left`;

  const minutes = Math.max(1, Math.floor(remaining / 60_000));
  return `${minutes}m left`;
}

const statusStyles = {
  leading: "bg-emerald-50 text-emerald-700",
  outbid: "bg-amber-50 text-amber-700",
  won: "bg-emerald-50 text-emerald-700",
  reserved: "bg-indigo-50 text-indigo-700",
  sold: "bg-indigo-50 text-indigo-700",
  failed_pickup: "bg-amber-50 text-amber-700",
  rejected: "bg-red-50 text-red-700",
  unsold: "bg-slate-100 text-slate-600",
  cancelled: "bg-slate-100 text-slate-600",
  awaiting_seller_decision: "bg-violet-50 text-violet-700",
};

export default function BuyerBidCard({ bid }) {
  const isOutbid = bid.status === "outbid";
  const statusLabels = {
    leading: "You're leading",
    outbid: "You've been outbid",
    won: "You won",
    reserved: "Winner confirmed",
    sold: "Sale completed",
    failed_pickup: "Pickup failed",
    rejected: "Bid rejected",
    unsold: "Unsold",
    cancelled: "Cancelled",
    awaiting_seller_decision: "Awaiting seller decision",
  };
  const statusLabel = statusLabels[bid.status] || bid.status;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <img
          src={bid.image}
          alt={bid.title}
          className="h-36 w-full rounded-xl bg-slate-100 object-cover sm:h-28 sm:w-32"
          loading="lazy"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-slate-400">
                {bid.category}
              </p>
              <h3 className="mt-1 text-base font-semibold text-slate-900">
                {bid.title}
              </h3>
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                statusStyles[bid.status] || "bg-slate-100 text-slate-600"
              }`}
            >
              {statusLabel}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">Current bid</p>
              <p className="mt-1 font-bold text-slate-900">
                {formatCurrency(bid.currentBid)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Your highest bid</p>
              <p className="mt-1 font-semibold text-slate-700">
                {formatCurrency(bid.myHighestBid)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Time remaining</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Clock3 size={14} />
                {formatTimeRemaining(bid.endsAt)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Gavel size={14} />
              {bid.bidCount} total bids
            </span>

            <Link
              to={`/auctions/${bid.auctionId}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            >
              {isOutbid ? "Place a higher bid" : "View auction"}
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
