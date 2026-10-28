import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest, mapAuction } from "../../../services/api.js";
import { connectAuctionSocket } from "../../../services/auctionSocket.js";
import useAuth from "../../auth/hooks/useAuth.js";
import { categories } from "../data/mockAuctions.js";

export function useMarketplace() {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id;
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [condition, setCondition] = useState("All conditions");
  const [endingSoon, setEndingSoon] = useState(false);
  const [sort, setSort] = useState("ending");
  const [maxPrice, setMaxPrice] = useState("all");
  const [savedWatchlist, setSavedWatchlist] = useState({
    userId: "",
    ids: [],
  });
  const savedIds =
    savedWatchlist.userId === userId ? savedWatchlist.ids : [];

  const loadAuctions = useCallback(async () => {
    try {
      const result = await apiRequest("/auctions");
      setAuctions(result.auctions.map(mapAuction));
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to load marketplace listings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadAuctions);
    const socket = connectAuctionSocket();
    socket.on("auction:updated", loadAuctions);

    return () => {
      socket.off("auction:updated", loadAuctions);
      socket.disconnect();
    };
  }, [loadAuctions]);

  useEffect(() => {
    let active = true;
    if (authLoading) return undefined;
    if (!userId) return undefined;

    apiRequest("/dashboard")
      .then(({ dashboard }) => {
        if (active) {
          setSavedWatchlist({
            userId,
            ids: dashboard.watchlist.map((auction) => auction._id),
          });
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.message || "Unable to load your saved auctions."
          );
        }
      });

    return () => {
      active = false;
    };
  }, [authLoading, userId]);

  useEffect(() => {
    const updateTime = () => setNow(Date.now());
    updateTime();
    const intervalId = setInterval(updateTime, 60_000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredAuctions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const endingSoonCutoff = now === null ? null : now + 24 * 60 * 60 * 1000;

    const results = auctions.filter((auction) => {
      const searchableText = [
        auction.title,
        auction.category,
        auction.condition,
        auction.seller,
        auction.location,
        auction.description ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesCategory =
        selectedCategory === "All Items" ||
        auction.category === selectedCategory;
      const matchesCondition =
        condition === "All conditions" || auction.condition === condition;
      const matchesPrice =
        maxPrice === "all" || auction.currentBid <= Number(maxPrice);
      const closingTime = new Date(auction.endsAt).getTime();
      const matchesClosingTime =
        !endingSoon ||
        (now !== null &&
          closingTime >= now &&
          closingTime <= endingSoonCutoff);

      return (
        matchesQuery &&
        matchesCategory &&
        matchesCondition &&
        matchesPrice &&
        matchesClosingTime
      );
    });

    return results.sort((a, b) => {
      switch (sort) {
        case "price-low":
          return a.currentBid - b.currentBid;
        case "price-high":
          return b.currentBid - a.currentBid;
        case "most-bids":
          return b.bidCount - a.bidCount;
        case "ending":
          return new Date(a.endsAt) - new Date(b.endsAt);
        case "newest":
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });
  }, [
    auctions,
    query,
    selectedCategory,
    condition,
    endingSoon,
    maxPrice,
    sort,
    now,
  ]);

  const featuredAuctions = useMemo(
    () => filteredAuctions.filter((auction) => auction.featured),
    [filteredAuctions]
  );

  async function toggleSaved(auctionId) {
    if (!userId) {
      setError("Sign in to save auctions to your watchlist.");
      return;
    }

    const saved = savedIds.includes(auctionId);
    setSavedWatchlist((current) => {
      const currentIds =
        current.userId === userId ? current.ids : [];
      return {
        userId,
        ids: saved
          ? currentIds.filter((id) => id !== auctionId)
          : [...currentIds, auctionId],
      };
    });

    try {
      await apiRequest(`/dashboard/watchlist/${auctionId}`, {
        method: saved ? "DELETE" : "POST",
      });
      setError("");
    } catch (requestError) {
      setSavedWatchlist((current) => {
        if (current.userId !== userId) return current;
        const currentlySaved = current.ids.includes(auctionId);
        const ids = saved
          ? currentlySaved
            ? current.ids
            : [...current.ids, auctionId]
          : current.ids.filter((id) => id !== auctionId);
        return { ...current, ids };
      });
      setError(requestError.message || "Unable to update your watchlist.");
    }
  }

  function resetFilters() {
    setQuery("");
    setSelectedCategory("All Items");
    setCondition("All conditions");
    setEndingSoon(false);
    setSort("ending");
    setMaxPrice("all");
  }

  return {
    auctions,
    loading,
    error,
    query,
    setQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    condition,
    setCondition,
    endingSoon,
    setEndingSoon,
    sort,
    setSort,
    maxPrice,
    setMaxPrice,
    savedIds,
    toggleSaved,
    filteredAuctions,
    featuredAuctions,
    resetFilters,
  };
}
