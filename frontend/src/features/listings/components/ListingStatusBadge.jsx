
import {
  Ban,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ShieldCheck,
  XCircle,
} from "lucide-react";

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
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 ring-red-600/15",
    Icon: Ban,
  },
  reserved: {
    label: "Reserved",
    className: "bg-violet-50 text-violet-700 ring-violet-600/15",
    Icon: ShieldCheck,
  },
  awaiting_seller_decision: {
    label: "Awaiting decision",
    className: "bg-amber-50 text-amber-700 ring-amber-600/15",
    Icon: Clock3,
  },
  unsold: {
    label: "Unsold",
    className: "bg-slate-100 text-slate-600 ring-slate-500/15",
    Icon: XCircle,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 ring-red-600/15",
    Icon: XCircle,
  },
  failed_pickup: {
    label: "Pickup failed",
    className: "bg-amber-50 text-amber-700 ring-amber-600/15",
    Icon: Clock3,
  },
};

export default function ListingStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.ended;
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
