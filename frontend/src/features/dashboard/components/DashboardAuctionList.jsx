
import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDashboardCurrency } from "../utils/dashboardUtils.js";

function getStatus(item, type) {
  if (type === "listings") return item.dashboardStatus;
  if (type === "bids") {
    return item.status === "leading"
      ? "Leading (demo)"
      : item.status === "outbid"
        ? "Outbid (demo)"
        : item.status;
  }
  if (type === "wins") return "Won (demo)";
  if (type === "watchlist") return "Watching (demo)";

  return "Available";
}

function statusStyles(status) {
  if (status.startsWith("Leading") || status.startsWith("Won")) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status.startsWith("Outbid")) {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "Active" || status.startsWith("Watching")) {
    return "bg-indigo-50 text-indigo-700";
  }

  return "bg-slate-100 text-slate-600";
}

export default function DashboardAuctionList({ items, type }) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const auction = type === "bids" ? item.auction : item;
        const status = getStatus(item, type);

        return (
          <article
            key={
              type === "bids"
                ? `${item.auctionId}-bid`
                : auction.id
            }
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 sm:flex-row sm:items-center sm:p-5"
          >
            <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-28">
              {auction.image ? (
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No image
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900">
                  {auction.title}
                </h3>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles(status)}`}
                >
                  {status}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {auction.category}
                {auction.condition ? ` · ${auction.condition}` : ""}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                {auction.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} />
                    {auction.location}
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={14} />
                  {type === "bids"
                    ? `Your bid: ${formatDashboardCurrency(item.myBid)}`
                    : type === "listings"
                      ? `${auction.bidCount ?? 0} bids`
                      : `Current bid: ${formatDashboardCurrency(auction.currentBid)}`}
                </span>
              </div>
            </div>

            <Link
              to={`/auctions/${auction.id}`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              View auction
              <ArrowUpRight size={16} />
            </Link>
          </article>
        );
      })}
    </div>
  );
}
