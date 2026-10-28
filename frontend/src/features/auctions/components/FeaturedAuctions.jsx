import { Sparkles } from "lucide-react";
import AuctionCard from "./AuctionCard.jsx";

export default function FeaturedAuctions({
  auctions,
  savedIds,
  onToggleSaved,
  onOpen,
}) {
  if (auctions.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <Sparkles size={18} />
        </span>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Featured auctions
          </h2>
          <p className="text-sm text-slate-500">
            Listings worth checking out
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {auctions.map((auction) => (
          <AuctionCard
            key={auction.id}
            auction={auction}
            isSaved={savedIds.includes(auction.id)}
            onToggleSaved={onToggleSaved}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  );
}