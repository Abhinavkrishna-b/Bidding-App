
import { useEffect, useState } from "react";
import {
  getMinimumBid,
  getTimeRemaining,
  validateBid,
} from "../utils/biddingUtils.js";

function createInitialHistory(auction) {
  const currentBid = Number(auction.currentBid) || 0;
  const startingPrice = Number(auction.startingPrice) || 0;

  if (currentBid <= 0) return [];

  if (currentBid === startingPrice) {
    return [
      {
        id: "initial-bid",
        bidder: "Campus bidder",
        amount: currentBid,
        time: "Starting price",
      },
    ];
  }

  return [
    {
      id: "latest-demo-bid",
      bidder: "Campus bidder",
      amount: currentBid,
      time: "Latest recorded bid",
    },
    {
      id: "starting-demo-bid",
      bidder: "Campus bidder",
      amount: startingPrice,
      time: "Opening price",
    },
  ];
}

export default function useAuctionDetails(auction) {
  const [currentBid, setCurrentBid] = useState(
    () => Number(auction?.currentBid) || 0
  );

  const [bidHistory, setBidHistory] = useState(() =>
    auction ? createInitialHistory(auction) : []
  );

  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [notice, setNotice] = useState("");

  // Pure initial value: no Date.now() during render.
  const [now, setNow] = useState(0);

  useEffect(() => {
    const updateClock = () => {
      setNow(Date.now());
    };

    updateClock();

    const intervalId = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const minimumBid = getMinimumBid(
    currentBid,
    auction?.startingPrice
  );

  const timeRemaining = getTimeRemaining(auction?.endsAt, now);
  const isEnded = timeRemaining?.ended ?? false;

  function placeBid(event) {
    event.preventDefault();
    setNotice("");

    if (isEnded) {
      setBidError("This auction has ended. Bidding is closed.");
      return;
    }

    const result = validateBid(
      bidAmount,
      currentBid,
      auction?.startingPrice
    );

    if (!result.valid) {
      setBidError(result.message);
      return;
    }

    const newBid = Number(bidAmount);

    setCurrentBid(newBid);

    setBidHistory((previous) => [
      {
        id: `demo-${Date.now()}`,
        bidder: "You (demo)",
        amount: newBid,
        time: "Just now",
      },
      ...previous,
    ]);

    setBidAmount("");
    setBidError("");

    setNotice(
      "Demo bid accepted for this session. It has not been saved to a server."
    );
  }

  function updateBidAmount(value) {
    setBidAmount(value);
    setBidError("");
    setNotice("");
  }

  return {
    currentBid,
    bidHistory,
    bidAmount,
    bidError,
    notice,
    minimumBid,
    timeRemaining,
    isEnded,
    placeBid,
    updateBidAmount,
  };
}
