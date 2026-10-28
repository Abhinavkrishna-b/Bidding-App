
import { mockAuctions } from "../../auctions/data/mockAuctions.js";

// Prototype-only ownership and management states.
// Replace with authenticated API data when the backend is ready.

const listingStates = {
  "auc-001": "active",
  "auc-004": "ended",
  "auc-006": "sold",
  "auc-008": "draft",
};

export const mockMyListings = mockAuctions
  .filter((auction) => listingStates[auction.id])
  .map((auction) => ({
    ...auction,
    status: listingStates[auction.id],
    description:
      auction.description ||
      `Details for ${auction.title}. Contact the seller to arrange a convenient campus pickup.`,
    createdAt: "Recently listed",
  }));
