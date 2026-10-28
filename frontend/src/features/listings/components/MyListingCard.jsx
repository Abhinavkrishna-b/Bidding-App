
import {
  Clock3,
  Eye,
  MapPin,
  MoreHorizontal,
  Pencil,
  Ban,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ListingStatusBadge from "./ListingStatusBadge.jsx";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export default function MyListingCard({
  listing,
  onEdit,
  onAction,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = listing.status === "active";
  const canManage = isActive && listing.bidCount === 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-52 shrink-0 bg-slate-100 sm:h-auto sm:min-h-52 sm:w-52">
          {listing.image ? (
            <img
              src={listing.image}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-40 items-center justify-center text-sm text-slate-400">
              No image available
            </div>
          )}

          <div className="absolute left-3 top-3">
            <ListingStatusBadge status={listing.status} />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {listing.category}
              </p>

              <h2 className="mt-1.5 line-clamp-2 text-lg font-semibold text-slate-900">
                {listing.title}
              </h2>
            </div>

            {canManage && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  aria-label={`Actions for ${listing.title}`}
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  <MoreHorizontal size={20} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-10 z-10 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(listing);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit listing
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onAction(listing, "cancel");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-700 hover:bg-red-50"
                    >
                      <Ban size={15} />
                      Cancel listing
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {listing.description || "No description provided."}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            {listing.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {listing.location}
              </span>
            )}

            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} />
              {listing.createdAt || "Listing date unavailable"}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              <div>
                <p className="text-xs text-slate-500">
                  {listing.bidCount === 0 ? "Starting price" : "Current bid"}
                </p>
                <p className="mt-1 text-base font-bold text-slate-900">
                  {formatCurrency(
                    listing.currentBid || listing.startingPrice
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Total bids</p>
                <p className="mt-1 text-base font-bold text-slate-900">
                  {listing.bidCount ?? 0}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {listing.status !== "cancelled" && (
                <Link
                  to={`/auctions/${listing.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Eye size={15} />
                  Preview
                </Link>
              )}

              {canManage && (
                <button
                  type="button"
                  onClick={() => onEdit(listing)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Pencil size={15} />
                  Edit
                </button>
              )}
            </div>
          </div>
          {isActive && listing.bidCount > 0 && (
            <p className="mt-3 text-xs text-slate-500">
              This listing has bids, so its details and cancellation are locked to keep bidding fair.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
