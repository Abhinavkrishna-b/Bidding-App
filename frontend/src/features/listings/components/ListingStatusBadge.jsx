
import { CheckCircle2, Clock3, FileEdit, PackageCheck } from "lucide-react";

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    Icon: CheckCircle2,
  },
  ended: {
    label: "Ended",
    className: "bg-slate-100 text-slate-600 ring-slate-500/15",
    Icon: Clock3,
  },
  sold: {
    label: "Sold",
    className: "bg-indigo-50 text-indigo-700 ring-indigo-600/15",
    Icon: PackageCheck,
  },
  draft: {
    label: "Draft",
    className: "bg-amber-50 text-amber-700 ring-amber-600/15",
    Icon: FileEdit,
  },
};

export default function ListingStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.draft;
  const { Icon } = config;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}
