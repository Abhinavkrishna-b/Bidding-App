import { ArrowRight, ShieldCheck, Users, Zap } from "lucide-react";
import Button from "../../../components/Button.jsx";

export default function MarketplaceHero({ onExplore, totalAuctions }) {
  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-14">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative grid gap-10 md:grid-cols-[1.4fr_0.8fr] md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-indigo-200">
            <Zap size={14} />
            Your campus marketplace
          </span>

          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Great finds.
            <span className="block text-indigo-300">
              Better bids.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Buy and sell pre-loved essentials with fellow students.
            Discover useful finds and let transparent bidding decide
            the price.
          </p>

          <Button
            onClick={onExplore}
            className="mt-7"
          >
            Explore auctions
            <ArrowRight size={17} />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <Users className="text-indigo-300" size={22} />
            <p className="mt-4 text-2xl font-bold">Campus</p>
            <p className="mt-1 text-xs text-slate-400">
              Student community
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <ShieldCheck className="text-indigo-300" size={22} />
            <p className="mt-4 text-2xl font-bold">Open</p>
            <p className="mt-1 text-xs text-slate-400">
              Transparent bidding
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-300">Listings to explore</p>
            <p className="mt-1 text-3xl font-bold">
              {totalAuctions ?? 0}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}