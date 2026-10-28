
import { useEffect, useMemo, useState } from "react";
import {
  mockBuyerBids,
  mockBuyerWatchlist,
  mockBuyerWins,
} from "../data/mockBuyerActivity.js";

export default function useBuyerActivity() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const updateTime = () => setNow(Date.now());
    updateTime();

    const intervalId = setInterval(updateTime, 60_000);
    return () => clearInterval(intervalId);
  }, []);

  const activeBids = useMemo(
    () =>
      mockBuyerBids.filter(
        (bid) => now === null || new Date(bid.endsAt).getTime() > now
      ),
    [now]
  );

  const leadingCount = activeBids.filter(
    (bid) => bid.status === "leading"
  ).length;

  const outbidCount = activeBids.filter(
    (bid) => bid.status === "outbid"
  ).length;

  const endingSoonCount = activeBids.filter((bid) => {
    if (now === null) return false;

    const remaining = new Date(bid.endsAt).getTime() - now;
    return remaining > 0 && remaining <= 24 * 60 * 60 * 1000;
  }).length;

  return {
    activeBids,
    leadingCount,
    outbidCount,
    endingSoonCount,
    watchlist: mockBuyerWatchlist,
    wonAuctions: mockBuyerWins,
  };
}
