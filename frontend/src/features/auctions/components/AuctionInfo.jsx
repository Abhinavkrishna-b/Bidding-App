
import {
  ArrowLeft,
  MapPin,
  Package,
  Tag,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AuctionInfo({ auction }) {
  return (
    <section className="min-w-0">
      <Link
        to="/"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to marketplace
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {auction.category}
        </span>

        {auction.condition && (
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
            {auction.condition}
          </span>
        )}
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {auction.title}
      </h1>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
            <UserRound size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Seller</p>
            <p className="truncate text-sm font-semibold text-slate-800">
              {auction.seller || "Campus seller"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
            <MapPin size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Pickup location</p>
            <p className="truncate text-sm font-semibold text-slate-800">
              {auction.location || "Campus pickup"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-7">
        <h2 className="text-base font-semibold text-slate-900">
          Item description
        </h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
          {auction.description ||
            "The seller has not added a detailed description yet."}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-100 pt-5 text-sm text-slate-500">
        <span className="inline-flex items-center gap-2">
          <Tag size={16} />
          {auction.category}
        </span>
        <span className="inline-flex items-center gap-2">
          <Package size={16} />
          {auction.condition || "Condition not specified"}
        </span>
      </div>
    </section>
  );
}
