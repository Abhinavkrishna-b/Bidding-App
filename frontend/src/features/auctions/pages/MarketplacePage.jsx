import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../../../components/Navbar.jsx";
import { useMarketplace } from "../hooks/useMarketplace.js";

import MarketplaceHero from "../components/MarketplaceHero.jsx";
import MarketplaceToolbar from "../components/MarketplaceToolbar.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import FeaturedAuctions from "../components/FeaturedAuctions.jsx";
import AuctionGrid from "../components/AuctionGrid.jsx";
import AuctionDetailsModal from "../components/AuctionDetailsModal.jsx";
import NoticeToast from "../components/NoticeToast.jsx";

export default function MarketplacePage() {
  const marketplace = useMarketplace();

  const [selectedAuction, setSelectedAuction] = useState(null);
  const [notice, setNotice] = useState("");

  const searchRef = useRef(null);

  const focusSearch = useCallback(() => {
    searchRef.current?.focus();

    document.getElementById("marketplace")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const closeModal = useCallback(() => {
    setSelectedAuction(null);
  }, []);

  const closeNotice = useCallback(() => {
    setNotice("");
  }, []);

  useEffect(() => {
    function handleShortcut(event) {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const modifierPressed = isMac ? event.metaKey : event.ctrlKey;

      if (modifierPressed && event.key.toLowerCase() === "k") {
        event.preventDefault();
        focusSearch();
      }
    }

    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, [focusSearch]);

  return (
    <div
      id="top"
      className="min-h-screen bg-[#F7F8FC] text-slate-900"
    >
      <Navbar />

      <NoticeToast
        message={notice}
        onClose={closeNotice}
      />

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <MarketplaceHero
          onExplore={focusSearch}
          totalAuctions={marketplace.auctions.length}
        />

        <section
          id="marketplace"
          className="mt-10 scroll-mt-24"
        >
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Discover auctions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Find useful items from your campus community.
            </p>
          </div>

          <MarketplaceToolbar
            query={marketplace.query}
            setQuery={marketplace.setQuery}
            inputRef={searchRef}
            sort={marketplace.sort}
            setSort={marketplace.setSort}
            maxPrice={marketplace.maxPrice}
            setMaxPrice={marketplace.setMaxPrice}
            condition={marketplace.condition}
            setCondition={marketplace.setCondition}
            endingSoon={marketplace.endingSoon}
            setEndingSoon={marketplace.setEndingSoon}
            onReset={marketplace.resetFilters}
          />

          {marketplace.error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {marketplace.error}
            </p>
          )}

          {marketplace.loading && (
            <p role="status" className="mt-5 text-sm text-slate-500">
              Loading campus auctions...
            </p>
          )}

          <div className="mt-5">
            <CategoryFilter
              categories={marketplace.categories}
              selected={marketplace.selectedCategory}
              onSelect={marketplace.setSelectedCategory}
            />
          </div>

          {!marketplace.loading && (
            <FeaturedAuctions
              auctions={marketplace.featuredAuctions}
              savedIds={marketplace.savedIds}
              onToggleSaved={marketplace.toggleSaved}
              onOpen={setSelectedAuction}
            />
          )}

          {!marketplace.loading && (
            <AuctionGrid
              auctions={marketplace.filteredAuctions}
              savedIds={marketplace.savedIds}
              onToggleSaved={marketplace.toggleSaved}
              onOpen={setSelectedAuction}
              onReset={marketplace.resetFilters}
            />
          )}
        </section>

        <footer className="mt-16 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          Campus Auction · A marketplace built for campus communities
        </footer>
      </main>

      <AuctionDetailsModal
        auction={selectedAuction}
        onClose={closeModal}
        onNotice={setNotice}
      />
    </div>
  );
}