import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { apiRequest, mapAuction } from "../../../services/api.js";
import { connectAuctionSocket } from "../../../services/auctionSocket.js";
import useAuth from "../../auth/hooks/useAuth.js";

const outcomeLabels = {
  active: "Active",
  cancelled: "Cancelled",
  sold: "Sold",
  reserved: "Reserved",
  unsold: "Unsold",
  rejected: "Rejected",
  failed_pickup: "Pickup failed",
  awaiting_seller_decision: "Awaiting decision",
};

function mapSellerListing(auction) {
  const listing = mapAuction(auction);
  return {
    ...listing,
    dashboardStatus: outcomeLabels[listing.status] || "Ended",
  };
}

function mapBidActivity(activity) {
  const auction = mapAuction(activity.auction);
  return {
    id: `${activity.auctionId}-bid`,
    auctionId: activity.auctionId,
    auction,
    title: auction.title,
    category: auction.category,
    image: auction.image,
    currentBid: auction.currentBid,
    myHighestBid: activity.myHighestBid,
    myBid: activity.myHighestBid,
    bidCount: auction.bidCount,
    endsAt: auction.endsAt,
    status: activity.status,
    isActive: activity.isActive,
    latestBidAt: activity.latestBidAt,
  };
}

export default function useDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [myListings, setMyListings] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [bidCount, setBidCount] = useState(0);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState("");
  const dashboardRequestRef = useRef(0);

  const loadDashboard = useCallback(async () => {
    const requestId = ++dashboardRequestRef.current;
    setListingsLoading(true);
    try {
      const { dashboard } = await apiRequest("/dashboard");
      if (requestId !== dashboardRequestRef.current) return;
      setMyListings(dashboard.listings.map(mapSellerListing));
      setMyBids(dashboard.bids.map(mapBidActivity));
      setBidCount(dashboard.bidCount);
      setWatchlist(dashboard.watchlist.map(mapAuction));
      setWonAuctions(dashboard.wins.map(mapAuction));
      setListingsError("");
    } catch (error) {
      if (requestId !== dashboardRequestRef.current) return;
      setListingsError(error.message || "Unable to load your account activity.");
    } finally {
      if (requestId === dashboardRequestRef.current) {
        setListingsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadDashboard);
  }, [loadDashboard]);

  useEffect(() => {
    const socket = connectAuctionSocket();
    socket.on("auction:updated", () => void loadDashboard());
    return () => socket.disconnect();
  }, [loadDashboard]);

  const stats = useMemo(() => {
    const activeListings = myListings.filter(
      (item) => item.dashboardStatus === "Active"
    ).length;
    const activeBids = myBids.filter((bid) => bid.isActive);
    return [
      {
        id: "listings",
        label: "My listings",
        value: myListings.length,
        detail: `${activeListings} active`,
        icon: "package",
      },
      {
        id: "bids",
        label: "Bids placed",
        value: bidCount,
        detail: `${activeBids.length} active auctions`,
        icon: "gavel",
      },
      {
        id: "watchlist",
        label: "Watchlist",
        value: watchlist.length,
        detail: "Items you're following",
        icon: "heart",
      },
      {
        id: "wins",
        label: "Auctions won",
        value: wonAuctions.length,
        detail: "Approved winning bids",
        icon: "trophy",
      },
    ];
  }, [bidCount, myBids, myListings, watchlist.length, wonAuctions.length]);

  return {
    user,
    activeTab,
    setActiveTab,
    listingsLoading,
    listingsError,
    reloadListings: loadDashboard,
    stats,
    myListings,
    myBids,
    watchlist,
    wonAuctions,
  };
}
