
import { Gavel } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthBrand() {
  return (
    <Link
      to="/"
      aria-label="Campus Auction home"
      className="inline-flex items-center gap-2.5"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
        <Gavel size={23} />
      </span>

      <span className="text-xl font-bold tracking-tight text-slate-900">
        Campus<span className="text-indigo-600">Auction</span>
      </span>
    </Link>
  );
}
