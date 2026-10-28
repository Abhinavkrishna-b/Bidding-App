
import { useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <Link
        to="/signin"
        className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
      >
        <UserRound size={17} />
        Sign in
      </Link>
    );
  }

  function handleSignOut() {
    signOut();
    setOpen(false);
    navigate("/", { replace: true });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-100"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
          {user.initials || user.name?.charAt(0) || "S"}
        </span>

        <span className="hidden max-w-28 truncate text-sm font-semibold text-slate-700 sm:block">
          {user.name}
        </span>

        <ChevronDown size={15} className="text-slate-500" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
        >
          <div className="border-b border-slate-100 px-3 py-3">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user.name}
            </p>
            <p className="mt-1 truncate text-xs text-slate-500">
              {user.email}
            </p>
            <p className="mt-2 text-[11px] font-medium text-amber-700">
              Demo account
            </p>
          </div>

          <Link
            to="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <LayoutDashboard size={17} className="text-slate-500" />
            Dashboard
          </Link>

          <Link
            to="/my-listings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <Package size={17} className="text-slate-500" />
            My listings
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
