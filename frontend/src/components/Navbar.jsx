
import { Gavel, Plus, Store } from "lucide-react";
import { Link } from "react-router-dom";
import NotificationBell from "../features/notifications/components/NotificationBell.jsx";
import ProfileDropdown from "../features/auth/components/ProfileDropdown.jsx";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Campus Auction home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Gavel size={22} />
          </span>

          <span className="text-lg font-bold tracking-tight text-slate-900">
            Campus<span className="text-indigo-600">Auction</span>
          </span>
        </Link>

        {/* Navbar actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-700"
          >
            <Store size={17} />
            <span className="hidden sm:inline">Marketplace</span>
          </Link>

          {/* Sell an item */}
          <Link
            to="/listings/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">Sell an item</span>
            <span className="sm:hidden">Sell</span>
          </Link>

          {/* Notifications */}
          <NotificationBell />

          {/* Profile dropdown */}
          <ProfileDropdown />
        </div>
      </nav>
    </header>
  );
}
