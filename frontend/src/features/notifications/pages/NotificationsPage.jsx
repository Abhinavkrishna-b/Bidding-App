
import { useNavigate } from "react-router-dom";
import { BellRing, CheckCheck, Trash2 } from "lucide-react";
import Navbar from "../../../components/Navbar.jsx";
import NotificationFilters from "../components/NotificationFilters.jsx";
import NotificationItem from "../components/NotificationItem.jsx";
import AuctionResultCard, {
  mockAuctionResults,
} from "../components/AuctionResultCard.jsx";
import useNotifications from "../hooks/useNotifications.js";

export default function NotificationsPage() {
  const navigate = useNavigate();

  const {
    notifications,
    filteredNotifications,
    unreadCount,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearReadNotifications,
  } = useNotifications();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        onSearch={() => navigate("/")}
        onSell={() => navigate("/listings/new")}
      />

      <main className="mx-auto max-w-5xl space-y-7 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              <BellRing size={14} />
              Activity center
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Notifications
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Stay updated on bids, auctions ending soon and your auction results.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <CheckCheck size={16} />
                Mark all read
              </button>
            )}

            {notifications.some((item) => item.read) && (
              <button
                type="button"
                onClick={clearReadNotifications}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 size={16} />
                Clear read
              </button>
            )}
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total notifications</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {notifications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Unread</p>
            <p className="mt-2 text-2xl font-bold text-indigo-700">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Auction results</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {mockAuctionResults.length}
            </p>
          </div>
        </section>

        <NotificationFilters
          filter={filter}
          onFilterChange={setFilter}
          unreadCount={unreadCount}
        />

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent activity
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your latest auction notifications
            </p>
          </div>

          {filteredNotifications.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="divide-y divide-slate-100">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={markAsRead}
                    onRemove={removeNotification}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
              <BellRing
                size={30}
                strokeWidth={1.5}
                className="mx-auto text-slate-400"
              />
              <h3 className="mt-4 font-semibold text-slate-900">
                No notifications found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try another filter or check back when there is new auction activity.
              </p>
            </div>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Auction results
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Example completed-auction results for the prototype
            </p>
          </div>

          <div className="space-y-3">
            {mockAuctionResults.map((result) => (
              <AuctionResultCard key={result.id} result={result} />
            ))}
          </div>
        </section>

        <p className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-500">
          Prototype mode: notification read states and auction results use
          local mock data. They are not verified server events and may reset
          when the page reloads.
        </p>
      </main>
    </div>
  );
}
