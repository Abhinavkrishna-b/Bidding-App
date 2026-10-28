import { SearchX } from "lucide-react";
import Button from "../../../components/Button.jsx";

export default function EmptyState({ onReset }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <SearchX size={25} />
      </span>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No auctions found
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Try a different search term or adjust your category and price filters.
      </p>

      <Button onClick={onReset} variant="secondary" className="mt-5">
        Clear filters
      </Button>
    </div>
  );
}