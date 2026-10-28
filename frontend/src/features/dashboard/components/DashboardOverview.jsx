
import { ArrowRight, Gavel } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardAuctionList from "./DashboardAuctionList.jsx";
import DashboardEmptyState from "./DashboardEmptyState.jsx";

export default function DashboardOverview({
  myListings,
  myBids,
  onSelectTab,
}) {
  const recentBids = myBids.slice(0, 2);
  const recentListings = myListings.slice(0, 2);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-5 sm:p-7">
        <p className="text-sm font-semibold text-indigo-700">
          Your campus marketplace
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Buy, sell and bid with confidence.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Keep track of your listings and bids from one place.
          Explore items posted by other students or create a listing
          for something you no longer need.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/listings/new"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Create a listing
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Explore marketplace
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Your listings
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Items you've listed for auction
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab("listings")}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:text-indigo-800"
          >
            View all
            <ArrowRight size={16} />
          </button>
        </div>

        {recentListings.length ? (
          <DashboardAuctionList
            items={recentListings}
            type="listings"
          />
        ) : (
          <DashboardEmptyState
            title="No listings yet"
            description="List an item to start selling it to other students."
            actionLabel="Create a listing"
            actionTo="/listings/new"
          />
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent bids
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Keep an eye on your bidding activity
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab("bids")}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:text-indigo-800"
          >
            View all
            <ArrowRight size={16} />
          </button>
        </div>

        {recentBids.length ? (
          <DashboardAuctionList items={recentBids} type="bids" />
        ) : (
          <DashboardEmptyState
            title="No bids yet"
            description="Browse active auctions and place a bid on an item you like."
            actionLabel="Explore auctions"
            actionTo="/"
          />
        )}
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
          <Gavel size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Demo dashboard
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            This dashboard currently uses sample account data.
            Real listing ownership, bid status and auction outcomes
            will be loaded from the backend later.
          </p>
        </div>
      </div>
    </div>
  );
}
