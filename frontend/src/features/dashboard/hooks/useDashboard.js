
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest, mapAuction } from "../../../services/api.js";
import {
  getAuctionById,
  mockDashboardUser,
  mockMyBids,
  mockWatchlistIds,
  mockWonAuctionIds,
} from "../data/mockDashboardData.js";

export default function useDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [myListings, setMyListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState("");

  const loadMyListings = useCallback(async () => {
    setListingsLoading(true);
    try {
      const result = await apiRequest("/auctions/mine");
      setMyListings(
        result.auctions.map((auction) => {
          const listing = mapAuction(auction);

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

          return {
            ...listing,
            dashboardStatus: outcomeLabels[listing.status] || "Ended",
          };
        })
      );
      setListingsError("");
    } catch (error) {
      setListingsError(error.message || "Unable to load your listings.");
    } finally {
      setListingsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadMyListings);
  }, [loadMyListings]);

  const data = useMemo(() => {
    const myBids = mockMyBids
      .map((bid) => ({
        ...bid,
        auction: getAuctionById(bid.auctionId),
      }))
      .filter((bid) => bid.auction);

    const watchlist = mockWatchlistIds
      .map(getAuctionById)
      .filter(Boolean);

    const wonAuctions = mockWonAuctionIds
      .map(getAuctionById)
      .filter(Boolean);

    const activeListings = myListings.filter(
      (item) => item.dashboardStatus === "Active"
    );

    return {
      myBids,
      watchlist,
      wonAuctions,
      stats: [
        {
          id: "listings",
          label: "My listings",
          value: myListings.length,
          detail: `${activeListings.length} active`,
          icon: "package",
        },
        {
          id: "bids",
          label: "Bids placed",
          value: myBids.length,
          detail: `${myBids.filter((bid) => bid.status === "leading").length} leading`,
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
          detail: "Completed wins",
          icon: "trophy",
        },
      ],
    };
  }, [myListings]);

  return {
    user: mockDashboardUser,
    activeTab,
    setActiveTab,
    listingsLoading,
    listingsError,
    reloadListings: loadMyListings,
    ...data,
    myListings,
  };
}
