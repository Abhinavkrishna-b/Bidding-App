
import { Search, SlidersHorizontal } from "lucide-react";

const filters = [
  { value: "all", label: "All listings" },
  { value: "active", label: "Active" },
  { value: "ended", label: "Ended" },
  { value: "sold", label: "Sold" },
  { value: "draft", label: "Drafts" },
];

export default function ListingFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  counts,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search your listings..."
            aria-label="Search your listings"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <SlidersHorizontal size={17} />
          <span>Filter by status</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => {
          const selected = status === filter.value;
          const count = counts[filter.value] ?? 0;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onStatusChange(filter.value)}
              aria-pressed={selected}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                selected
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {filter.label}
              <span
                className={`rounded-md px-1.5 py-0.5 text-xs ${
                  selected
                    ? "bg-white/15 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
