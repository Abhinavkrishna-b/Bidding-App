
import { useEffect, useState } from "react";
import { Clock3, Gavel, MapPin, UserRound, X } from "lucide-react";
import Button from "../../../components/Button.jsx";
import {
  formatCurrency,
  formatDate,
  getTimeRemaining,
} from "../utils/auctionUtils.js";

export default function AuctionDetailsModal({
  auction,
  onClose,
  onNotice,
}) {
  const [ended, setEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!auction) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [auction, onClose]);

  useEffect(() => {
    if (!auction) return;

    const updateTime = () => {
      const now = Date.now();
      const endTime = new Date(auction.endsAt).getTime();

      setCurrentTime(now);
      setEnded(endTime <= now);
    };

    updateTime();

    const timerId = setInterval(updateTime, 1000);

    return () => clearInterval(timerId);
  }, [auction]);

  if (!auction) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auction-modal-title"
        className="my-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
          <p className="text-sm font-semibold text-slate-600">
            Auction details
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close auction details"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-2">
          <div className="bg-slate-50">
            <img
              src={auction.image}
              alt={auction.title}
              className="h-64 w-full object-cover md:h-full md:min-h-96"
            />
          </div>

          <div className="p-5 sm:p-7">
            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              {auction.category}
            </span>

            <h2
              id="auction-modal-title"
              className="mt-3 text-2xl font-bold tracking-tight text-slate-900"
            >
              {auction.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {auction.description}
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Current highest bid
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                {formatCurrency(auction.currentBid)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Starting price:{" "}
                {formatCurrency(auction.startingPrice)}
              </p>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <UserRound
                  size={16}
                  className="text-slate-400"
                />
                <span>
                  {auction.seller} · {auction.sellerDepartment}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Gavel
                  size={16}
                  className="text-slate-400"
                />
                <span>{auction.bidCount} bids placed</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Clock3
                  size={16}
                  className="text-slate-400"
                />
                <span>
                  {ended
                    ? "Auction ended"
                    : currentTime === 0
                      ? getTimeRemaining(auction.endsAt)
                      : getTimeRemaining(auction.endsAt)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <MapPin
                  size={16}
                  className="text-slate-400"
                />
                <span>
                  Campus pickup · Arrange with seller
                </span>
              </div>

              <p className="pt-1 text-xs text-slate-400">
                Listed on {formatDate(auction.createdAt)}
              </p>
            </div>

            <Button
              disabled={ended}
              onClick={() => {
                onNotice(
                  ended
                    ? "This auction has ended."
                    : "Bidding will be enabled when the bidding module is connected."
                );
                onClose();
              }}
              className="mt-6 w-full"
            >
              <Gavel size={17} />
              {ended ? "Auction ended" : "Place a bid"}
            </Button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
              Demo mode: bids are not submitted or saved yet.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
