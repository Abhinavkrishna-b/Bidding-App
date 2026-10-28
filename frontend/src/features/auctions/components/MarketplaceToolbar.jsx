import { Clock3, Search, SlidersHorizontal, X } from "lucide-react";

export default function MarketplaceToolbar({
  query,
  setQuery,
  inputRef,
  sort,
  setSort,
  maxPrice,
  setMaxPrice,
  condition,
  setCondition,
  endingSoon,
  setEndingSoon,
  onReset,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <label className="relative mb-4 block">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search items, categories, sellers..."
          aria-label="Search auctions"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <SlidersHorizontal size={16} />
          <span className="shrink-0">Condition</span>
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400"
          >
            <option value="All conditions">All conditions</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span className="shrink-0">Max bid</span>
          <select
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400"
          >
            <option value="all">Any price</option>
            <option value="1000">Up to ₹1,000</option>
            <option value="5000">Up to ₹5,000</option>
            <option value="10000">Up to ₹10,000</option>
            <option value="30000">Up to ₹30,000</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span className="shrink-0">Sort by</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400"
          >
            <option value="newest">Newest</option>
            <option value="ending">Ending soon</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="most-bids">Most bids</option>
          </select>
        </label>

        <button
          type="button"
          aria-pressed={endingSoon}
          onClick={() => setEndingSoon((isActive) => !isActive)}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
            endingSoon
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
          }`}
        >
          <Clock3 size={16} />
          Closing within 24h
        </button>

        <button
          type="button"
          onClick={onReset}
          className="ml-auto inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <X size={15} />
          Reset
        </button>
      </div>
    </div>
  );
}