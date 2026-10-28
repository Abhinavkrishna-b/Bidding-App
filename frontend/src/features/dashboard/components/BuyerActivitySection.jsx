
import { AlertCircle, Clock3, Gavel, TrendingUp } from "lucide-react";
import BuyerBidCard from "./BuyerBidCard.jsx";
import BuyerQuickLinks from "./BuyerQuickLinks.jsx";

function SummaryCard({ label, value, description, Icon, tone }) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <span className={`rounded-xl p-2.5 ${tones[tone]}`}>
          <Icon size={20} />
        </span>
      </div>
    </div>
  );
}

export default function BuyerActivitySection({
  activeBids,
  leadingCount,
  outbidCount,
  endingSoonCount,
  onSelectTab,
}) {
  const previewBids = [...activeBids]
    .sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "outbid" ? -1 : 1;
      }

      return new Date(a.endsAt) - new Date(b.endsAt);
    })
    .slice(0, 3);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Your buying activity
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Track your bids and identify auctions that need your attention.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Active bids"
          value={activeBids.length}
          description="Active auctions you're bidding on"
          Icon={Gavel}
          tone="indigo"
        />

        <SummaryCard
          label="You're leading"
          value={leadingCount}
          description="Your bid is currently the highest"
          Icon={TrendingUp}
          tone="emerald"
        />

        <SummaryCard
          label="Outbid"
          value={outbidCount}
          description="Auctions where a higher bid exists"
          Icon={AlertCircle}
          tone="amber"
        />

        <SummaryCard
          label="Ending soon"
          value={endingSoonCount}
          description="Active bids ending within 24 hours"
          Icon={Clock3}
          tone="slate"
        />
      </div>

      <BuyerQuickLinks onSelectTab={onSelectTab} />

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Bids that need your attention
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Outbid auctions are shown first.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab("bids")}
            className="text-sm font-semibold text-indigo-700 transition hover:text-indigo-900"
          >
            View all bids
          </button>
        </div>

        {previewBids.length > 0 ? (
          <div className="space-y-3">
            {previewBids.map((bid) => (
              <BuyerBidCard key={bid.id} bid={bid} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
            <Gavel size={27} className="mx-auto text-slate-400" />
            <h4 className="mt-3 font-semibold text-slate-900">
              No active bids
            </h4>
            <p className="mt-1 text-sm text-slate-500">
              Browse the marketplace and find something worth bidding on.
            </p>
            <a
              href="/"
              className="mt-4 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Explore auctions
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
