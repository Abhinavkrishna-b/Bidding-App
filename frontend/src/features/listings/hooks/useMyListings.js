
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest, mapAuction } from "../../../services/api.js";

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
      const now = Date.now();
      setListings(
        result.auctions.map((auction) => {
          const listing = mapAuction(auction);
          return {
            ...listing,
            status:
              listing.status === "active" &&
              new Date(listing.endsAt).getTime() <= now
                ? "ended"
                : listing.status,
          };
        })
      );
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
    if (action !== "cancel") return;

    setSaving(true);
    setError("");
    try {
      await apiRequest(`/auctions/${listing.id}/cancel`, {
        method: "POST",
      });
      setListings((previous) =>
        previous.map((item) =>
          item.id === listing.id
            ? { ...item, status: "cancelled" }
            : item
        )
      );
      setPendingAction(null);
      setNotice("Your listing has been cancelled.");
    } catch (requestError) {
      setError(requestError.message || "Unable to cancel this listing.");
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
