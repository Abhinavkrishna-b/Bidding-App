
import { History, TrendingUp } from "lucide-react";
import { formatCurrency } from "../utils/biddingUtils.js";

export default function BidHistory({ bidHistory }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Bid activity
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Recent activity for this auction
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
          <History size={20} />
        </div>
      </div>

      {bidHistory.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
          <TrendingUp size={24} className="mx-auto text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-700">
            No bids yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Be the first to place a bid on this item.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-slate-100">
          {bidHistory.map((bid, index) => (
            <div
              key={bid.id}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    index === 0
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {bid.bidder?.charAt(0)?.toUpperCase() || "B"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {bid.bidder}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {bid.time}
                  </p>
                </div>
              </div>

              <p className="shrink-0 text-sm font-bold text-slate-900">
                {formatCurrency(bid.amount)}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">
        Demo activity only. Verified bid records will be loaded from the
        backend when it is connected.
      </p>
    </section>
  );
}
