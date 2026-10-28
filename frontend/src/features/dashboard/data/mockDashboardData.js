
import { mockAuctions } from "../../auctions/data/mockAuctions.js";

// Prototype data only. Replace with authenticated API responses later.

export const mockDashboardUser = {
  name: "Abhinav",
  email: "student@campus.edu",
  initials: "A",
};

export const mockMyListingIds = ["auc-001", "auc-004"];

export const mockMyBids = [
  {
    auctionId: "auc-002",
    myBid: 850,
    status: "outbid",
    updatedAt: "Recently",
  },
  {
    auctionId: "auc-003",
    myBid: 1200,
    status: "leading",
    updatedAt: "Recently",
  },
  {
    auctionId: "auc-005",
    myBid: 450,
    status: "leading",
    updatedAt: "Earlier",
  },
];

export const mockWatchlistIds = ["auc-006", "auc-007"];

export const mockWonAuctionIds = [];

export function getAuctionById(id) {
  return mockAuctions.find((auction) => auction.id === id);
}
