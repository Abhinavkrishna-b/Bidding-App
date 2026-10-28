
import { Link, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar.jsx";
import useAuctionDetails from "../hooks/useAuctionDetails.js";
import AuctionImageGallery from "../components/AuctionImageGallery.jsx";
import AuctionInfo from "../components/AuctionInfo.jsx";
import BiddingPanel from "../components/BiddingPanel.jsx";
import BidHistory from "../components/BidHistory.jsx";
import AuctionNotFound from "../components/AuctionNotFound.jsx";

export default function AuctionDetailsPage() {
  const { auctionId } = useParams();
  const auctionDetails = useAuctionDetails(auctionId);
  const { auction } = auctionDetails;

  if (auctionDetails.loading) {
    return (
      <>
        <Navbar />
        <p role="status" className="p-10 text-center text-slate-500">
          Loading auction...
        </p>
      </>
    );
  }

  if (!auction || auctionDetails.error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50">
          {auctionDetails.error ? (
            <div className="mx-auto max-w-xl px-5 py-16 text-center">
              <p role="alert" className="text-sm text-red-700">
                {auctionDetails.error}
              </p>
              <Link
                to="/"
                className="mt-4 inline-block text-sm font-semibold text-indigo-700"
              >
                Back to marketplace
              </Link>
            </div>
          ) : (
            <AuctionNotFound />
          )}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.8fr)] lg:gap-10">
          <div className="min-w-0 space-y-8">
            <AuctionImageGallery auction={auction} />
            <AuctionInfo auction={auction} />
            <BidHistory bidHistory={auctionDetails.bidHistory} />
          </div>

          <BiddingPanel
            currentBid={auctionDetails.currentBid}
            startingPrice={auction.startingPrice}
            auctionStatus={auction.status}
            winner={auction.winner}
            bidAmount={auctionDetails.bidAmount}
            bidError={auctionDetails.bidError}
            notice={auctionDetails.notice}
            minimumBid={auctionDetails.minimumBid}
            timeRemaining={auctionDetails.timeRemaining}
            isEnded={auctionDetails.isEnded}
            isOwnAuction={auctionDetails.isOwnAuction}
            requiresSignIn={auctionDetails.requiresSignIn}
            onBidAmountChange={auctionDetails.updateBidAmount}
            onPlaceBid={auctionDetails.placeBid}
          />
        </div>
      </main>
    </div>
  );
}
