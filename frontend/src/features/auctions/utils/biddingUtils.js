
export const MINIMUM_BID_INCREMENT = 10;

export function getMinimumBid(currentBid, startingPrice) {
  const current = Number(currentBid) || 0;
  const starting = Number(startingPrice) || 0;

  return Math.max(current, starting) + MINIMUM_BID_INCREMENT;
}

export function validateBid(amount, currentBid, startingPrice) {
  const bid = Number(amount);
  const minimumBid = getMinimumBid(currentBid, startingPrice);

  if (amount === "" || amount === null || amount === undefined) {
    return { valid: false, message: "Enter your bid amount." };
  }

  if (!Number.isFinite(bid) || !Number.isInteger(bid)) {
    return {
      valid: false,
      message: "Enter a valid whole-number amount.",
    };
  }

  if (bid <= 0) {
    return {
      valid: false,
      message: "Your bid must be greater than zero.",
    };
  }

  if (bid < minimumBid) {
    return {
      valid: false,
      message: `Your bid must be at least ₹${minimumBid.toLocaleString("en-IN")}.`,
    };
  }

  return { valid: true, message: "" };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function getTimeRemaining(endsAt, now = Date.now()) {
  if (!endsAt) return null;

  const endTime = new Date(endsAt).getTime();

  if (!Number.isFinite(endTime)) return null;

  const difference = endTime - now;

  if (difference <= 0) {
    return {
      ended: true,
      text: "Auction ended",
    };
  }

  const days = Math.floor(difference / 86_400_000);
  const hours = Math.floor((difference % 86_400_000) / 3_600_000);
  const minutes = Math.floor((difference % 3_600_000) / 60_000);
  const seconds = Math.floor((difference % 60_000) / 1000);

  const parts = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);

  parts.push(`${minutes}m`, `${seconds}s`);

  return {
    ended: false,
    text: parts.join(" "),
  };
}
