
import { useMemo, useState } from "react";
import {
  getAuctionById,
  mockDashboardUser,
  mockMyBids,
  mockMyListingIds,
  mockWatchlistIds,
  mockWonAuctionIds,
} from "../data/mockDashboardData.js";
import { getListingStatus } from "../utils/dashboardUtils.js";


export default function useDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const data = useMemo(() => {
    const myListings = mockMyListingIds
      .map(getAuctionById)
      .filter(Boolean)
      .map((auction) => ({
        ...auction,
        dashboardStatus: getListingStatus(auction),
      }));

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
      myListings,
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
  }, []);

  return {
    user: mockDashboardUser,
    activeTab,
    setActiveTab,
    ...data,
  };
}
