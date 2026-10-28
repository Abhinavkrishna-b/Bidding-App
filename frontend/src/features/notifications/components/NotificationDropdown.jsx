
import { BellRing, CheckCheck, Inbox, X } from "lucide-react";
import { Link } from "react-router-dom";
import NotificationItem from "./NotificationItem.jsx";

export default function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onRemove,
  onClose,
}) {
  const recentNotifications = notifications.slice(0, 4);

  return (
    <div
      className="fixed inset-x-3 top-[4.75rem] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-[410px]"
      role="dialog"
      aria-label="Recent notifications"
    >
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-700">
            <BellRing size={19} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Notifications
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {unreadCount} unread
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="hidden items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 sm:inline-flex"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={17} />
          </button>
        </div>
      </header>

      <div className="max-h-[65vh] overflow-y-auto">
        {recentNotifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={onMarkRead}
                onRemove={onRemove}
                compact
              />
            ))}
          </div>
        ) : (
          <div className="px-5 py-10 text-center">
            <Inbox size={27} className="mx-auto text-slate-400" />
            <p className="mt-3 text-sm font-semibold text-slate-800">
              You're all caught up
            </p>
            <p className="mt-1 text-xs text-slate-500">
              New auction activity will appear here.
            </p>
          </div>
        )}
      </div>

      <footer className="border-t border-slate-100 p-3">
        <Link
          to="/notifications"
          onClick={onClose}
          className="flex w-full items-center justify-center rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
        >
          View all notifications
        </Link>
      </footer>
    </div>
  );
}
