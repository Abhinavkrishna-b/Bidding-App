
import { Filter } from "lucide-react";
import { NOTIFICATION_TYPES } from "../utils/notificationUtils.js";

export default function NotificationFilters({
  filter,
  onFilterChange,
  unreadCount,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Filter size={17} />
        Filter notifications
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {NOTIFICATION_TYPES.map((option) => {
          const selected = filter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onFilterChange(option.value)}
              aria-pressed={selected}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                selected
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {option.label}

              {option.value === "unread" && unreadCount > 0 && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs ${
                    selected
                      ? "bg-white/15 text-white"
                      : "bg-indigo-50 text-indigo-700"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
