import { ArrowRight, Gavel, Package } from "lucide-react";
import { Link } from "react-router-dom";
import BuyerBidCard from "./BuyerBidCard.jsx";
import DashboardAuctionList from "./DashboardAuctionList.jsx";

function ActivityEmptyState({ icon: Icon, title, description, to, action }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center">
      <Icon size={22} className="mx-auto text-slate-400" />
      <h4 className="mt-3 text-sm font-semibold text-slate-800">{title}</h4>
      <p className="mx-auto mt-1 max-w-xs text-sm leading-5 text-slate-500">
        {description}
      </p>
      <Link
        to={to}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
      >
        {action}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export default function DashboardOverview({
  myListings,
  buyerActivity,
  onSelectTab,
}) {
  const recentListings = myListings.slice(0, 2);
  const activeBids = buyerActivity?.activeBids ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-5 sm:p-6">
        <p className="text-sm font-semibold text-indigo-700">
          One student account, every side of the auction
        </p>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
          Buy from your campus community and sell items you no longer need.
          Your bids, watchlist, and listings are all together here.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                Selling
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Your listings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review your items and their auction activity.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab("listings")}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
            >
              View all
              <ArrowRight size={16} />
            </button>
          </div>

          {recentListings.length > 0 ? (
            <DashboardAuctionList items={recentListings} type="listings" />
          ) : (
            <ActivityEmptyState
              icon={Package}
              title="No listings yet"
              description="Give an item a new home by listing it for your campus."
              to="/listings/new"
              action="Create a listing"
            />
          )}
        </section>

        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                Buying
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Your active bids
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {buyerActivity?.outbidCount ?? 0} outbid ·{" "}
                {buyerActivity?.leadingCount ?? 0} leading
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab("bids")}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
            >
              View all
              <ArrowRight size={16} />
            </button>
          </div>

          {activeBids.length > 0 ? (
            <div className="space-y-3">
              {activeBids.slice(0, 2).map((bid) => (
                <BuyerBidCard key={bid.id} bid={bid} />
              ))}
            </div>
          ) : (
            <ActivityEmptyState
              icon={Gavel}
              title="No active bids"
              description="Explore current auctions and bid on something useful."
              to="/"
              action="Explore auctions"
            />
          )}
        </section>
      </div>
    </div>
  );
}
