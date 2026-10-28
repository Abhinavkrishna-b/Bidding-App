
export function formatDashboardCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function getListingStatus(auction) {
  if (!auction) return "Unavailable";

  if (auction.status === "ended" || auction.status === "sold") {
    return auction.status === "sold" ? "Sold" : "Ended";
  }

  if (auction.endsAt) {
    const endTime = new Date(auction.endsAt).getTime();

    if (Number.isFinite(endTime) && endTime <= Date.now()) {
      return "Ended";
    }
  }

  return "Active";
}

export function getBidStatusLabel(status) {
  const labels = {
    leading: "Leading",
    outbid: "Outbid",
    won: "Won",
    lost: "Ended",
  };

  return labels[status] || "Unknown";
}
