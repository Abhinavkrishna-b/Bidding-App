
import { Package, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyListingsHeader({ totalListings }) {
  return (
    <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
          <Package size={14} />
          Seller workspace
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My listings
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Manage your campus listings, review auction activity and
          keep your item details up to date.
        </p>

        <p className="mt-3 text-sm font-medium text-slate-600">
          {totalListings} {totalListings === 1 ? "listing" : "listings"} in your workspace
        </p>
      </div>

      <Link
        to="/listings/new"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
      >
        <Plus size={18} />
        Create listing
      </Link>
    </section>
  );
}
