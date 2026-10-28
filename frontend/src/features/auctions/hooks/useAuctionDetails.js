import { useEffect, useRef, useState } from "react";
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
  const bidRequestRef = useRef(null);

  useEffect(() => {
    bidRequestRef.current = null;
  }, [auctionId]);

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
    socket.on("auction:updated", (event) => {
      if (String(event.id) !== String(auctionId)) return;
      setAuction((current) =>
        current
          ? {
              ...current,
              status: event.status ?? current.status,
              winner: event.winner ?? current.winner,
            }
          : current
      );
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
      const amount = Number(bidAmount);
      if (bidRequestRef.current?.amount !== amount) {
        const storageKey = `auction-bid-request:${auction.id}:${amount}`;
        bidRequestRef.current = {
          amount,
          storageKey,
          requestId:
            sessionStorage.getItem(storageKey) || crypto.randomUUID(),
        };
        sessionStorage.setItem(
          storageKey,
          bidRequestRef.current.requestId
        );
      }

      const response = await apiRequest(`/auctions/${auction.id}/bids`, {
        method: "POST",
        body: {
          amount,
          requestId: bidRequestRef.current.requestId,
        },
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
      sessionStorage.removeItem(bidRequestRef.current.storageKey);
      bidRequestRef.current = null;
      setBidAmount("");
      setNotice("Your bid was placed.");
    } catch (requestError) {
      setBidError(requestError.message || "Unable to place your bid.");
    }
  }

  function updateBidAmount(value) {
    setBidAmount(value);
    if (Number(value) !== bidRequestRef.current?.amount) {
      bidRequestRef.current = null;
    }
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
