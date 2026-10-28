
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar.jsx";
import { mockAuctions } from "../data/mockAuctions.js";
import useAuctionDetails from "../hooks/useAuctionDetails.js";
import AuctionImageGallery from "../components/AuctionImageGallery.jsx";
import AuctionInfo from "../components/AuctionInfo.jsx";
import BiddingPanel from "../components/BiddingPanel.jsx";
import BidHistory from "../components/BidHistory.jsx";
import AuctionNotFound from "../components/AuctionNotFound.jsx";

export default function AuctionDetailsPage() {
  const { auctionId } = useParams();

  const auction = mockAuctions.find(
    (item) => item.id === auctionId
  );

  const auctionDetails = useAuctionDetails(auction);

  if (!auction) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50">
          <AuctionNotFound />
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
            bidAmount={auctionDetails.bidAmount}
            bidError={auctionDetails.bidError}
            notice={auctionDetails.notice}
            minimumBid={auctionDetails.minimumBid}
            timeRemaining={auctionDetails.timeRemaining}
            isEnded={auctionDetails.isEnded}
            onBidAmountChange={auctionDetails.updateBidAmount}
            onPlaceBid={auctionDetails.placeBid}
          />
        </div>
      </main>
    </div>
  );
}
