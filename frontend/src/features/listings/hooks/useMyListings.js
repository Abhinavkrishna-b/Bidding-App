
import { useMemo, useState } from "react";
import { mockMyListings } from "../data/mockMyListings.js";

export default function useMyListings() {
  const [listings, setListings] = useState(() =>
    mockMyListings.map((listing) => ({ ...listing }))
  );
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editingListing, setEditingListing] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [notice, setNotice] = useState("");

  const counts = useMemo(() => {
    const result = {
      all: listings.length,
      active: 0,
      ended: 0,
      sold: 0,
      draft: 0,
    };

    listings.forEach((listing) => {
      if (Object.hasOwn(result, listing.status)) {
        result[listing.status] += 1;
      }
    });

    return result;
  }, [listings]);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesStatus =
        status === "all" || listing.status === status;

      const matchesSearch =
        !query ||
        listing.title.toLowerCase().includes(query) ||
        listing.category.toLowerCase().includes(query) ||
        (listing.location || "").toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [listings, search, status]);

  function saveListing(id, updates) {
    setListings((previous) =>
      previous.map((listing) =>
        listing.id === id
          ? { ...listing, ...updates }
          : listing
      )
    );

    setEditingListing(null);
    setNotice("Listing changes updated in this demo session.");
  }

  function confirmAction() {
    if (!pendingAction) return;

    const { listing, action } = pendingAction;

    if (action === "end") {
      setListings((previous) =>
        previous.map((item) =>
          item.id === listing.id
            ? { ...item, status: "ended" }
            : item
        )
      );

      setNotice("Auction marked as ended in the demo.");
    }

    if (action === "publish") {
      setListings((previous) =>
        previous.map((item) =>
          item.id === listing.id
            ? { ...item, status: "active" }
            : item
        )
      );

      setNotice("Draft marked as active in the demo.");
    }

    if (action === "delete") {
      setListings((previous) =>
        previous.filter((item) => item.id !== listing.id)
      );

      setNotice("Listing record removed from the demo.");
    }

    setPendingAction(null);
  }

  return {
    listings: filteredListings,
    totalListings: listings.length,
    counts,
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
