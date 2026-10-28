
import { useEffect, useState } from "react";
import { Clock3, Heart, Gavel, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import {
  formatCurrency,
  getTimeRemaining,
} from "../utils/auctionUtils.js";

export default function AuctionCard({
  auction,
  isSaved,
  onToggleSaved,
  onOpen,
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const ended = new Date(auction.endsAt).getTime() <= now;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60">
      <div className="relative">
        <button
          type="button"
          onClick={() => onOpen(auction)}
          className="block w-full text-left"
          aria-label={`View ${auction.title}`}
        >
          <img
            src={auction.image}
            alt={auction.title}
            loading="lazy"
            className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </button>

        <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {auction.condition}
        </span>

        <button
          type="button"
          onClick={() => onToggleSaved(auction.id)}
          aria-label={
            isSaved
              ? "Remove from watchlist"
              : "Save to watchlist"
          }
          aria-pressed={isSaved}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ${
            isSaved
              ? "bg-rose-50 text-rose-600"
              : "bg-white/95 text-slate-600 hover:text-rose-600"
          }`}
        >
          <Heart
            size={18}
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {auction.category}
        </p>

        <button
          type="button"
          onClick={() => onOpen(auction)}
          className="mt-1 block text-left"
        >
          <h3 className="line-clamp-1 text-base font-bold text-slate-900 hover:text-indigo-700">
            {auction.title}
          </h3>
        </button>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">
              Current bid
            </p>
            <p className="mt-0.5 text-xl font-bold text-slate-900">
              {formatCurrency(auction.currentBid)}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Gavel size={14} />
            {auction.bidCount} bids
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="flex min-w-0 items-center gap-1.5">
            <UserRound size={14} />
            <span className="truncate">
              {auction.seller}
            </span>
          </span>

          <span
            className={`flex shrink-0 items-center gap-1 ${
              ended
                ? "text-rose-600"
                : "text-amber-700"
            }`}
          >
            <Clock3 size={14} />
            {ended
              ? "Auction ended"
              : getTimeRemaining(auction.endsAt)}
          </span>
        </div>

        <Link
          to={`/auctions/${auction.id}`}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        >
          View auction
        </Link>
      </div>
    </article>
  );
}
