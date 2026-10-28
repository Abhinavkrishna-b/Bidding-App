
import {
  LayoutDashboard,
  Package,
  Gavel,
  Heart,
  Trophy,
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "listings", label: "My listings", icon: Package },
  { id: "bids", label: "My bids", icon: Gavel },
  { id: "watchlist", label: "Watchlist", icon: Heart },
  { id: "wins", label: "Won auctions", icon: Trophy },
];

export default function DashboardTabs({ activeTab, onChange }) {
  return (
    <nav
      aria-label="Dashboard sections"
      className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={active ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition sm:px-4 ${
              active
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon size={17} />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
