import AuctionCard from "./AuctionCard.jsx";
import EmptyState from "./EmptyState.jsx";

export default function AuctionGrid({
  auctions,
  savedIds,
  onToggleSaved,
  onOpen,
  onReset,
}) {
  const regularAuctions = auctions.filter(
    (auction) => !auction.featured
  );

  return (
    <section className="mt-10">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            All auctions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Browse items listed by students
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {auctions.length} {auctions.length === 1 ? "result" : "results"}
        </span>
      </div>

      {regularAuctions.length === 0 ? (
        auctions.length === 0 ? (
          <EmptyState onReset={onReset} />
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            All matching auctions are shown in the featured section above.
          </p>
        )
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {regularAuctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              isSaved={savedIds.includes(auction.id)}
              onToggleSaved={onToggleSaved}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </section>
  );
}