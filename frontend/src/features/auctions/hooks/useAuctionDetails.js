import { useEffect, useState } from "react";
import { apiRequest, mapAuction } from "../../../services/api.js";
import { connectAuctionSocket } from "../../../services/auctionSocket.js";
import useAuth from "../../auth/hooks/useAuth.js";
import {
  getMinimumBid,
  getTimeRemaining,
  validateBid,
} from "../utils/biddingUtils.js";

function mapBid(bid) {
  return {
    id: bid._id || bid.id,
    bidder:
      typeof bid.bidder === "object" ? bid.bidder?.name || "Student" : bid.bidder,
    amount: bid.amount,
    time: new Date(bid.placedAt).toLocaleString(),
  };
}

function addBid(history, bid) {
  if (history.some((existing) => existing.id === bid.id)) return history;
  return [mapBid(bid), ...history];
}

export default function useAuctionDetails(auctionId) {
  const { user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loadedAuctionId, setLoadedAuctionId] = useState("");
  const [now, setNow] = useState(0);

  useEffect(() => {
    let active = true;

    Promise.all([
      apiRequest(`/auctions/${auctionId}`),
      apiRequest(`/auctions/${auctionId}/bids`),
    ])
      .then(([auctionResult, bidResult]) => {
        if (!active) return;
        setAuction(mapAuction(auctionResult.auction));
        setBidHistory(bidResult.bids.map(mapBid));
        setError("");
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message || "Unable to load this auction.");
        }
      })
      .finally(() => {
        if (active) setLoadedAuctionId(auctionId);
      });

    return () => {
      active = false;
    };
  }, [auctionId]);

  useEffect(() => {
    const socket = connectAuctionSocket();
    socket.emit("auction:join", auctionId);
    socket.on("bid:placed", (event) => {
      setAuction((current) =>
        current
          ? {
              ...current,
              currentBid: event.auction.currentBid,
              bidCount: event.auction.bidCount,
            }
          : current
      );
      setBidHistory((current) => addBid(current, event.bid));
    });

    return () => socket.disconnect();
  }, [auctionId]);

  useEffect(() => {
    const updateClock = () => setNow(Date.now());
    updateClock();
    const intervalId = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const currentBid = auction?.currentBid ?? 0;
  const minimumBid = auction
    ? getMinimumBid(
        auction.bidCount === 0 ? 0 : currentBid,
        auction.startingPrice,
        auction.minimumBidIncrement
      )
    : 0;
  const timeRemaining = getTimeRemaining(auction?.endsAt, now);
  const isEnded =
    !auction ||
    auction.status !== "active" ||
    (timeRemaining?.ended ?? false);
  const isOwnAuction =
    Boolean(user && auction?.sellerId) &&
    String(user.id) === String(auction.sellerId);

  async function placeBid(event) {
    event.preventDefault();
    setNotice("");
    setBidError("");

    if (!user) {
      setBidError("Sign in to place a bid.");
      return;
    }

    const result = validateBid(
      bidAmount,
      auction?.bidCount === 0 ? 0 : currentBid,
      auction?.startingPrice,
      auction?.minimumBidIncrement
    );
    if (!result.valid) {
      setBidError(result.message);
      return;
    }

    try {
      const response = await apiRequest(`/auctions/${auction.id}/bids`, {
        method: "POST",
        body: { amount: Number(bidAmount), requestId: crypto.randomUUID() },
      });

      setAuction((current) =>
        current
          ? {
              ...current,
              currentBid: response.auction.currentBid,
              bidCount: response.auction.bidCount,
            }
          : current
      );
      setBidHistory((current) => addBid(current, response.bid));
      setBidAmount("");
      setNotice("Your bid was placed.");
    } catch (requestError) {
      setBidError(requestError.message || "Unable to place your bid.");
    }
  }

  function updateBidAmount(value) {
    setBidAmount(value);
    setBidError("");
    setNotice("");
  }

  return {
    auction,
    loading: loadedAuctionId !== auctionId,
    error,
    currentBid,
    bidHistory,
    bidAmount,
    bidError,
    notice,
    minimumBid,
    timeRemaining,
    isEnded,
    isOwnAuction,
    requiresSignIn: !user,
    placeBid,
    updateBidAmount,
  };
}
