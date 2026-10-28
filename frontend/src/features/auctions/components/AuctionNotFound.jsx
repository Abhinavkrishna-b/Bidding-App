
import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuctionNotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <div className="rounded-2xl bg-slate-100 p-5 text-slate-500">
        <SearchX size={36} strokeWidth={1.5} />
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
        Auction not found
      </h1>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        This auction may have been removed, or the link may be incorrect.
        Return to the marketplace to explore other items.
      </p>

      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        <ArrowLeft size={17} />
        Back to marketplace
      </Link>
    </main>
  );
}
