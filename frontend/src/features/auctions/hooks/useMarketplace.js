
import { useEffect, useMemo, useState } from "react";
import { mockAuctions, categories } from "../data/mockAuctions.js";

export function useMarketplace() {
  const [now, setNow] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [condition, setCondition] = useState("All conditions");
  const [endingSoon, setEndingSoon] = useState(false);
  const [sort, setSort] = useState("ending");
  const [maxPrice, setMaxPrice] = useState("all");
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const updateTime = () => setNow(Date.now());
    updateTime();

    const intervalId = setInterval(updateTime, 60_000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredAuctions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const endingSoonCutoff = now === null ? null : now + 24 * 60 * 60 * 1000;

    const results = mockAuctions.filter((auction) => {
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
          // Your current mock data doesn't contain createdAt.
          // Use the original array order as the fallback.
          return (
            mockAuctions.findIndex((item) => item.id === a.id) -
            mockAuctions.findIndex((item) => item.id === b.id)
          );
      }
    });
  }, [query, selectedCategory, condition, endingSoon, maxPrice, sort, now]);

  const featuredAuctions = useMemo(
    () => filteredAuctions.filter((auction) => auction.featured),
    [filteredAuctions]
  );

  function toggleSaved(auctionId) {
    setSavedIds((currentIds) =>
      currentIds.includes(auctionId)
        ? currentIds.filter((id) => id !== auctionId)
        : [...currentIds, auctionId]
    );
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
