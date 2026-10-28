
import { ArrowRight, Heart, Package, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  {
    label: "My bids",
    description: "Track leading and outbid auctions",
    tab: "bids",
    Icon: ArrowRight,
  },
  {
    label: "Watchlist",
    description: "Return to saved auctions",
    tab: "watchlist",
    Icon: Heart,
  },
  {
    label: "Won auctions",
    description: "Review completed auction results",
    tab: "wins",
    Icon: Trophy,
  },
];

export default function BuyerQuickLinks({ onSelectTab }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {links.map(({ label, description, tab, Icon }) => (
        <button
          key={tab}
          type="button"
          onClick={() => onSelectTab(tab)}
          className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-indigo-100 group-hover:text-indigo-700">
            <Icon size={19} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-slate-900">
              {label}
            </span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">
              {description}
            </span>
          </span>
        </button>
      ))}

      <Link
        to="/"
        className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 transition hover:bg-indigo-50 sm:col-span-3"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-700">
          <Package size={19} />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold text-slate-900">
            Explore the marketplace
          </span>
          <span className="mt-1 block text-xs text-slate-600">
            Discover new items available for bidding.
          </span>
        </span>
        <ArrowRight size={18} className="text-indigo-700" />
      </Link>
    </section>
  );
}
