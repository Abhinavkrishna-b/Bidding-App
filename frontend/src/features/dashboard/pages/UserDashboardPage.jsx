
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar.jsx";
import DashboardHeader from "../components/DashboardHeader.jsx";
import DashboardStats from "../components/DashboardStats.jsx";
import DashboardTabs from "../components/DashboardTabs.jsx";
import DashboardOverview from "../components/DashboardOverview.jsx";
import DashboardAuctionList from "../components/DashboardAuctionList.jsx";
import DashboardEmptyState from "../components/DashboardEmptyState.jsx";
import BuyerBidCard from "../components/BuyerBidCard.jsx";
import useDashboard from "../hooks/useDashboard.js";
import useBuyerActivity from "../hooks/useBuyerActivity.js";
import useAuth from "../../auth/hooks/useAuth.js";

const sectionInfo = {
  listings: {
    title: "My listings",
    description: "Manage and review items you've listed.",
    emptyTitle: "No listings yet",
    emptyDescription:
      "Create your first listing to sell an item on campus.",
    actionLabel: "Create a listing",
    actionTo: "/listings/new",
  },
  bids: {
    title: "My bids",
    description: "Review your bids and check their current status.",
    emptyTitle: "No bids yet",
    emptyDescription:
      "Explore the marketplace to find something worth bidding on.",
    actionLabel: "Explore auctions",
    actionTo: "/",
  },
  watchlist: {
    title: "My watchlist",
    description: "Keep track of auctions you want to follow.",
    emptyTitle: "Your watchlist is empty",
    emptyDescription:
      "Find interesting items and add them to your watchlist.",
    actionLabel: "Browse items",
    actionTo: "/",
  },
  wins: {
    title: "Won auctions",
    description: "Review items you've won in completed auctions.",
    emptyTitle: "No auction wins yet",
    emptyDescription:
      "Your completed wins will appear here when available.",
    actionLabel: "Explore auctions",
    actionTo: "/",
  },
};

export default function UserDashboardPage() {
  const navigate = useNavigate();

  const {
    user,
    activeTab,
    setActiveTab,
    stats,
    myListings,
    listingsLoading,
    listingsError,
    reloadListings,
    myBids,
    watchlist,
    wonAuctions,
  } = useDashboard();

  const buyerActivity = useBuyerActivity();
  const { user: signedInUser } = useAuth();

  const sectionItems = {
    listings: myListings,
    bids: myBids,
    watchlist,
    wins: wonAuctions,
  };

  const section = sectionInfo[activeTab];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        onSearch={() => navigate("/")}
        onSell={() => navigate("/listings/new")}
      />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <DashboardHeader user={signedInUser || user} />

        <DashboardStats
          stats={stats}
          onSelectTab={setActiveTab}
        />

        <DashboardTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "overview" ? (
          <DashboardOverview
            myListings={myListings}
            listingsLoading={listingsLoading}
            listingsError={listingsError}
            onReloadListings={reloadListings}
            myBids={myBids}
            onSelectTab={setActiveTab}
            buyerActivity={buyerActivity}
          />
        ) : (
          <section className="space-y-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {section.title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {section.description}
              </p>
            </div>

            {activeTab === "listings" && listingsLoading ? (
              <p className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center text-sm text-slate-500">
                Loading your listings...
              </p>
            ) : activeTab === "listings" && listingsError ? (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center text-sm text-red-800"
              >
                <p>{listingsError}</p>
                <button
                  type="button"
                  onClick={reloadListings}
                  className="mt-3 font-semibold underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
            ) : activeTab === "bids" ? (
              buyerActivity.activeBids.length > 0 ? (
                <div className="space-y-3">
                  {buyerActivity.activeBids.map((bid) => (
                    <BuyerBidCard
                      key={bid.id}
                      bid={bid}
                    />
                  ))}
                </div>
              ) : (
                <DashboardEmptyState
                  title="No active bids"
                  description="Your active bidding activity will appear here."
                  actionLabel="Explore auctions"
                  actionTo="/"
                />
              )
            ) : sectionItems[activeTab].length > 0 ? (
              <DashboardAuctionList
                items={sectionItems[activeTab]}
                type={activeTab}
              />
            ) : (
              <DashboardEmptyState
                title={section.emptyTitle}
                description={section.emptyDescription}
                actionLabel={section.actionLabel}
                actionTo={section.actionTo}
              />
            )}
          </section>
        )}
      </main>
    </div>
  );
}
