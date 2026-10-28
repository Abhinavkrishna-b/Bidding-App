
import {
  Gavel,
  Heart,
  Package,
  Trophy,
  ArrowUpRight,
} from "lucide-react";

const iconMap = {
  package: Package,
  gavel: Gavel,
  heart: Heart,
  trophy: Trophy,
};

export default function DashboardStats({ stats, onSelectTab }) {
  const tabByStat = {
    listings: "listings",
    bids: "bids",
    watchlist: "watchlist",
    wins: "wins",
  };

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon];

        return (
          <button
            key={stat.id}
            type="button"
            onClick={() => onSelectTab(tabByStat[stat.id])}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-100"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
                <Icon size={21} />
              </div>
              <ArrowUpRight
                size={17}
                className="text-slate-400 transition group-hover:text-indigo-600"
              />
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              {stat.label}
            </p>

            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {stat.value}
            </p>

            <p className="mt-2 text-xs text-slate-500">{stat.detail}</p>
          </button>
        );
      })}
    </section>
  );
}
