
import { Gavel, ShieldCheck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/biddingUtils.js";
import AuctionStatus from "./AuctionStatus.jsx";

export default function BiddingPanel({
  currentBid,
  startingPrice,
  auctionStatus,
  winner,
  bidAmount,
  bidError,
  notice,
  minimumBid,
  timeRemaining,
  isEnded,
  isOwnAuction,
  requiresSignIn,
  onBidAmountChange,
  onPlaceBid,
}) {
  const outcomeMessages = {
    awaiting_seller_decision:
      "The auction ended. The seller is reviewing the highest bid.",
    reserved: "The seller approved the winning bid. The item is reserved.",
    sold: "The campus handover is complete. This item is sold.",
    unsold: "The auction ended without any bids.",
    rejected: "The seller rejected the winning bid.",
    cancelled: "The seller cancelled this auction or reserved sale.",
    failed_pickup: "The reserved winner did not complete the pickup.",
  };
  const outcomeMessage = outcomeMessages[auctionStatus];

  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-500">
          Current highest bid
        </span>
        <TrendingUp size={19} className="text-indigo-600" />
      </div>

      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {formatCurrency(currentBid || startingPrice)}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Starting price: {formatCurrency(startingPrice)}
      </p>

      <div className="mt-5">
        <AuctionStatus
          timeRemaining={timeRemaining}
          isEnded={isEnded}
        />
      </div>

      {outcomeMessage && (
        <p
          role="status"
          className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700"
        >
          {outcomeMessage}
          {auctionStatus === "awaiting_seller_decision" && winner?.name
            ? ` Provisional winner: ${winner.name}.`
            : ""}
        </p>
      )}

      <form onSubmit={onPlaceBid} className="mt-6">
        <label
          htmlFor="bid-amount"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Your bid amount (₹)
        </label>

        <input
          id="bid-amount"
          name="bidAmount"
          type="number"
          min={minimumBid}
          step="1"
          inputMode="numeric"
          value={bidAmount}
          onChange={(event) => onBidAmountChange(event.target.value)}
          placeholder={`Minimum ₹${minimumBid.toLocaleString("en-IN")}`}
          disabled={isEnded || isOwnAuction}
          aria-invalid={Boolean(bidError)}
          aria-describedby={bidError ? "bid-error" : "bid-hint"}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />

        {isOwnAuction ? (
          <p className="mt-2 text-sm text-slate-500">
            You cannot bid on your own listing.
          </p>
        ) : requiresSignIn ? (
          <Link
            to="/signin"
            className="mt-2 inline-flex text-sm font-semibold text-indigo-700 hover:text-indigo-800"
          >
            Sign in to place a bid
          </Link>
        ) : bidError ? (
          <p id="bid-error" role="alert" className="mt-2 text-sm text-red-600">
            {bidError}
          </p>
        ) : (
          <p id="bid-hint" className="mt-2 text-xs text-slate-500">
            Enter at least {formatCurrency(minimumBid)}.
          </p>
        )}

        <button
          type="submit"
          disabled={isEnded || isOwnAuction}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Gavel size={18} />
          {isEnded
            ? "Bidding closed"
            : isOwnAuction
              ? "Your listing"
              : "Place bid"}
        </button>
      </form>

      {notice && (
        <p
          role="status"
          className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800"
        >
          {notice}
        </p>
      )}

      <div className="mt-5 flex items-start gap-2 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-slate-400" />
        <p>
          Your bid is recorded publicly. The seller arranges pickup after the
          auction closes.
        </p>
      </div>
    </aside>
  );
}
