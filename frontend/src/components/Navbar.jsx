import { useState } from "react";
import { Gavel, Plus, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar({
  onProfile,
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Campus Auction home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Gavel size={22} />
          </span>

          <span className="text-lg font-bold tracking-tight text-slate-900">
            Campus<span className="text-indigo-600">Auction</span>
          </span>
        </a>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/listings/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">Sell an item</span>
            <span className="sm:hidden">Sell</span>
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((open) => !open)}
              aria-label="Open user profile"
              aria-expanded={isProfileOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-indigo-50 text-indigo-700 transition hover:bg-indigo-100 sm:w-auto sm:gap-2 sm:px-3"
            >
              <UserRound size={18} />
              <span className="hidden text-sm font-medium sm:inline">Profile</span>
            </button>

            {isProfileOpen && (
              <div
                role="dialog"
                aria-label="User profile"
                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                    <UserRound size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Campus student
                    </p>
                    <p className="text-xs text-slate-500">Guest profile</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Profile and account features will be available soon.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onProfile();
                  }}
                  className="mt-3 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Got it
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}