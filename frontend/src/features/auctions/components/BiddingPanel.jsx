
import { Gavel, ShieldCheck, TrendingUp } from "lucide-react";
import { formatCurrency } from "../utils/biddingUtils.js";
import AuctionStatus from "./AuctionStatus.jsx";

export default function BiddingPanel({
  currentBid,
  startingPrice,
  bidAmount,
  bidError,
  notice,
  minimumBid,
  timeRemaining,
  isEnded,
  onBidAmountChange,
  onPlaceBid,
}) {
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
          disabled={isEnded}
          aria-invalid={Boolean(bidError)}
          aria-describedby={bidError ? "bid-error" : "bid-hint"}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />

        {bidError ? (
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
          disabled={isEnded}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Gavel size={18} />
          {isEnded ? "Bidding closed" : "Place bid"}
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
          Prototype mode: bids are simulated in your current session.
          No payment is collected, and no bid is saved to the server.
        </p>
      </div>
    </aside>
  );
}
