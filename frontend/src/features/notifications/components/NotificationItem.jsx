
import {
  Bell,
  CheckCircle2,
  Clock3,
  Gavel,
  TrendingDown,
  Trophy,
  ExternalLink,
  Check,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  formatNotificationCurrency,
  getNotificationTime,
} from "../utils/notificationUtils.js";

const notificationStyles = {
  outbid: {
    Icon: TrendingDown,
    iconClass: "bg-amber-50 text-amber-700",
  },
  new_bid: {
    Icon: Gavel,
    iconClass: "bg-indigo-50 text-indigo-700",
  },
  ending_soon: {
    Icon: Clock3,
    iconClass: "bg-orange-50 text-orange-700",
  },
  won: {
    Icon: Trophy,
    iconClass: "bg-emerald-50 text-emerald-700",
  },
  ended: {
    Icon: CheckCircle2,
    iconClass: "bg-slate-100 text-slate-600",
  },
};

export default function NotificationItem({
  notification,
  onMarkRead,
  onRemove,
  compact = false,
}) {
  const config =
    notificationStyles[notification.type] || {
      Icon: Bell,
      iconClass: "bg-slate-100 text-slate-600",
    };

  const { Icon } = config;
  const amount = formatNotificationCurrency(notification.amount);

  return (
    <article
      className={`group flex gap-3 transition ${
        compact ? "p-3" : "p-4 sm:p-5"
      } ${
        notification.read
          ? "bg-white"
          : "bg-indigo-50/50"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconClass}`}
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                {notification.title}
              </h3>

              {!notification.read && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
              )}
            </div>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {notification.message}
            </p>

            {amount && (
              <p className="mt-2 text-sm font-semibold text-slate-800">
                Bid amount: {amount}
              </p>
            )}

            <p className="mt-2 text-xs text-slate-400">
              {getNotificationTime(notification.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            to={`/auctions/${notification.auctionId}`}
            onClick={() => onMarkRead(notification.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            View auction
            <ExternalLink size={13} />
          </Link>

          {!notification.read && (
            <button
              type="button"
              onClick={() => onMarkRead(notification.id)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              <Check size={14} />
              Mark as read
            </button>
          )}

          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(notification.id)}
              aria-label={`Remove notification: ${notification.title}`}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={14} />
              {compact ? "" : "Dismiss"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
