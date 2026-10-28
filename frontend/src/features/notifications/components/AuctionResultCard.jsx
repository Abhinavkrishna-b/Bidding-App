
import { ArrowUpRight, Trophy, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatNotificationCurrency } from "../utils/notificationUtils.js";

export default function AuctionResultCard({ result }) {
  const isWon = result.status === "won";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 sm:p-6">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            isWon
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {isWon ? (
            <Trophy size={22} />
          ) : (
            <XCircle size={22} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900">
              {result.title}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                isWon
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {isWon ? "Won · Demo" : "Not won · Demo"}
            </span>
          </div>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {result.description}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Final bid</p>
              <p className="mt-1 font-bold text-slate-900">
                {formatNotificationCurrency(result.finalBid)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Ended</p>
              <p className="mt-1 text-sm font-medium text-slate-700">
                {result.endedAt}
              </p>
            </div>
          </div>

          <Link
            to={`/auctions/${result.auctionId}`}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            View auction
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

// Sample results for the frontend prototype.
export const mockAuctionResults = [
  {
    id: "result-001",
    auctionId: "auc-003",
    title: "Notebook Bundle",
    description: "Example of a successful winning result.",
    status: "won",
    finalBid: 450,
    endedAt: "27 Oct 2026",
  },
  {
    id: "result-002",
    auctionId: "auc-005",
    title: "USB-C Hub",
    description: "Example of an auction you did not win.",
    status: "lost",
    finalBid: 950,
    endedAt: "27 Oct 2026",
  },
];
