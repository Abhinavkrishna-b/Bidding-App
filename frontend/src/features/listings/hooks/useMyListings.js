
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest, mapAuction } from "../../../services/api.js";
import { connectAuctionSocket } from "../../../services/auctionSocket.js";

const endedStatuses = new Set([
  "ended",
  "awaiting_seller_decision",
  "reserved",
  "unsold",
  "rejected",
  "failed_pickup",
]);

export default function useMyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editingListing, setEditingListing] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [notice, setNotice] = useState("");

  const loadListings = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiRequest("/auctions/mine");
      setListings(result.auctions.map(mapAuction));
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to load your listings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadListings);
  }, [loadListings]);

  useEffect(() => {
    const socket = connectAuctionSocket();
    socket.on("auction:updated", (event) => {
      setListings((currentListings) =>
        currentListings.map((listing) =>
          listing.id === event.id
            ? {
                ...listing,
                status: event.status ?? listing.status,
                currentBid: event.currentBid ?? listing.currentBid,
                bidCount: event.bidCount ?? listing.bidCount,
                winner:
                  typeof event.winner === "object"
                    ? event.winner
                    : listing.winner,
              }
            : listing
        )
      );
    });

    return () => socket.disconnect();
  }, []);

  const counts = useMemo(() => {
    const result = {
      all: listings.length,
      active: 0,
      ended: 0,
      sold: 0,
      cancelled: 0,
    };

    listings.forEach((listing) => {
      if (listing.status === "active") result.active += 1;
      else if (listing.status === "sold") result.sold += 1;
      else if (listing.status === "cancelled") result.cancelled += 1;
      else if (endedStatuses.has(listing.status)) result.ended += 1;
    });

    return result;
  }, [listings]);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesStatus =
        status === "all" ||
        listing.status === status ||
        (status === "ended" && endedStatuses.has(listing.status));

      const matchesSearch =
        !query ||
        listing.title.toLowerCase().includes(query) ||
        listing.category.toLowerCase().includes(query) ||
        (listing.location || "").toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [listings, search, status]);

  async function saveListing(id, updates) {
    setSaving(true);
    setError("");
    try {
      const body = new FormData();
      body.append("title", updates.title);
      body.append("category", updates.category);
      body.append("condition", updates.condition);
      body.append("description", updates.description);
      body.append("startingPrice", String(updates.startingPrice));
      body.append(
        "minimumBidIncrement",
        String(updates.minimumBidIncrement)
      );
      body.append("location", updates.location);
      if (updates.imageFile) body.append("image", updates.imageFile);

      const result = await apiRequest(`/auctions/${id}`, {
        method: "PATCH",
        body,
      });
      const listing = mapAuction(result.auction);
      setListings((previous) =>
        previous.map((item) => (item.id === id ? listing : item))
      );
      setEditingListing(null);
      setNotice("Your listing changes have been saved.");
    } catch (requestError) {
      setError(requestError.message || "Unable to save listing changes.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmAction() {
    if (!pendingAction) return;
    const { listing, action } = pendingAction;
    const actionRequests = {
      cancel: {
        path: `/auctions/${listing.id}/cancel`,
        body: undefined,
        message: "Your listing has been cancelled.",
      },
      cancel_sale: {
        path: `/auctions/${listing.id}/cancel`,
        body: undefined,
        message: "The reserved sale has been cancelled.",
      },
      approve: {
        path: `/auctions/${listing.id}/decision`,
        body: { decision: "approve" },
        message: "The winning bid is approved and reserved for the winner.",
      },
      reject: {
        path: `/auctions/${listing.id}/decision`,
        body: { decision: "reject" },
        message: "The winning bid has been rejected.",
      },
      complete: {
        path: `/auctions/${listing.id}/pickup`,
        body: { outcome: "completed" },
        message: "The handover is recorded and the auction is marked sold.",
      },
      failed_pickup: {
        path: `/auctions/${listing.id}/pickup`,
        body: { outcome: "failed" },
        message: "The failed pickup has been recorded.",
      },
    };
    const request = actionRequests[action];
    if (!request) return;

    setSaving(true);
    setError("");
    try {
      const result = await apiRequest(request.path, {
        method: "POST",
        body: request.body,
      });
      const updatedListing = mapAuction(result.auction);
      setListings((previous) =>
        previous.map((item) =>
          item.id === listing.id ? updatedListing : item
        )
      );
      setPendingAction(null);
      setNotice(request.message);
    } catch (requestError) {
      setError(requestError.message || "Unable to record this auction outcome.");
    } finally {
      setSaving(false);
    }
  }

  return {
    listings: filteredListings,
    totalListings: listings.length,
    counts,
    loading,
    error,
    saving,
    reloadListings: loadListings,
    search,
    setSearch,
    status,
    setStatus,
    editingListing,
    setEditingListing,
    saveListing,
    pendingAction,
    setPendingAction,
    confirmAction,
    notice,
    clearNotice: () => setNotice(""),
  };
}
