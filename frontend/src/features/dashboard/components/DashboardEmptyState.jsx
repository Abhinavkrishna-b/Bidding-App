
import { ArrowRight, Inbox } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardEmptyState({
  title,
  description,
  actionLabel,
  actionTo = "/",
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center sm:px-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Inbox size={26} strokeWidth={1.5} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {actionLabel && (
        <Link
          to={actionTo}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {actionLabel}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
