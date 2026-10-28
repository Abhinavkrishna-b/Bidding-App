import { useEffect, useMemo, useState } from "react";

export default function useBuyerActivity(bids) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const updateTime = () => setNow(Date.now());
    updateTime();
    const intervalId = setInterval(updateTime, 60_000);
    return () => clearInterval(intervalId);
  }, []);

  const activeBids = useMemo(
    () => bids.filter((bid) => bid.isActive),
    [bids]
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

  return { activeBids, leadingCount, outbidCount, endingSoonCount };
}
