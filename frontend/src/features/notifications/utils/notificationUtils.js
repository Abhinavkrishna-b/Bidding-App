
export const NOTIFICATION_TYPES = [
  { value: "all", label: "All notifications" },
  { value: "unread", label: "Unread" },
  { value: "outbid", label: "Outbid" },
  { value: "new_bid", label: "New bids" },
  { value: "ending_soon", label: "Ending soon" },
  { value: "won", label: "Won" },
  { value: "ended", label: "Ended" },
];

export function formatNotificationCurrency(amount) {
  if (amount === null || amount === undefined) return null;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function getNotificationTime(dateValue, now = Date.now()) {
  const timestamp = new Date(dateValue).getTime();

  if (!Number.isFinite(timestamp)) return "Time unavailable";

  const difference = Math.max(0, now - timestamp);
  const minutes = Math.floor(difference / 60_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp);
}

export function getNotificationIconType(type) {
  const iconTypes = {
    outbid: "trending-down",
    new_bid: "gavel",
    ending_soon: "clock",
    won: "trophy",
    ended: "check-circle",
  };

  return iconTypes[type] || "bell";
}

export function filterNotifications(notifications, filter) {
  if (filter === "all") return notifications;
  if (filter === "unread") {
    return notifications.filter((item) => !item.read);
  }

  return notifications.filter((item) => item.type === filter);
}

export function sortNotifications(notifications) {
  return [...notifications].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );
}
