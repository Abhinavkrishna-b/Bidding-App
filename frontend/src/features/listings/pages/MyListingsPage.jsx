
import { useNavigate } from "react-router-dom";
import { CheckCircle2, PackageSearch } from "lucide-react";
import Navbar from "../../../components/Navbar.jsx";
import MyListingsHeader from "../components/MyListingsHeader.jsx";
import ListingFilters from "../components/ListingFilters.jsx";
import MyListingCard from "../components/MyListingCard.jsx";
import EditListingModal from "../components/EditListingModal.jsx";
import ListingActionDialog from "../components/ListingActionDialog.jsx";
import useMyListings from "../hooks/useMyListings.js";

export default function MyListingsPage() {
  const navigate = useNavigate();

  const {
    listings,
    totalListings,
    counts,
    loading,
    error,
    saving,
    reloadListings,
    search,
    setSearch,
    status,
    setStatus,
    editingListing,
    setEditingListing,
    saveListing,
    pendingAction,
    setPendingAction,
    confirmAction,
    notice,
    clearNotice,
  } = useMyListings();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        onSearch={() => navigate("/")}
        onSell={() => navigate("/listings/new")}
      />

      <main className="mx-auto max-w-7xl space-y-7 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <MyListingsHeader totalListings={totalListings} />

        {notice && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1">{notice}</p>
            <button
              type="button"
              onClick={clearNotice}
              aria-label="Dismiss notification"
              className="font-semibold hover:text-emerald-950"
            >
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={reloadListings}
              className="shrink-0 font-semibold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        <ListingFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          counts={counts}
        />

        <section aria-live="polite" className="space-y-4">
          {loading ? (
            <p className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center text-sm text-slate-500">
              Loading your listings...
            </p>
          ) : listings.length > 0 ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {listings.length}
                  </span>{" "}
                  {listings.length === 1 ? "listing" : "listings"}
                </p>
              </div>

              {listings.map((listing) => (
                <MyListingCard
                  key={listing.id}
                  listing={listing}
                  onEdit={setEditingListing}
                  onAction={(selectedListing, action) =>
                    setPendingAction({
                      listing: selectedListing,
                      action,
                    })
                  }
                />
              ))}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <PackageSearch size={27} strokeWidth={1.5} />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                {search || status !== "all"
                  ? "No matching listings"
                  : "No listings yet"}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search || status !== "all"
                  ? "Try another search term or status filter."
                  : "Create your first listing to start selling items on campus."}
              </p>

              {search || status !== "all" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                  }}
                  className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/listings/new")}
                  className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Create a listing
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <EditListingModal
        key={editingListing?.id || "closed"}
        listing={editingListing}
        error={error}
        isSaving={saving}
        onClose={() => setEditingListing(null)}
        onSave={(updates) =>
          saveListing(editingListing.id, updates)
        }
      />

      <ListingActionDialog
        listing={pendingAction?.listing}
        action={pendingAction?.action}
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmAction}
        isLoading={saving}
      />
    </div>
  );
}
