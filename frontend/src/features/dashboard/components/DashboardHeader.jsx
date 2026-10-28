
import { ArrowUpRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardHeader({ user }) {
  return (
    <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-sm">
          {user.initials}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">
            Student dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, {user.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      <Link
        to="/listings/new"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
      >
        <Plus size={18} />
        Create a listing
        <ArrowUpRight size={16} />
      </Link>
    </section>
  );
}
