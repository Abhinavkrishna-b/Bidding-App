
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MarketplacePage from "./features/auctions/pages/MarketplacePage.jsx";
import AuctionDetailsPage from "./features/auctions/pages/AuctionDetailsPage.jsx";
import CreateListingPage from "./features/listings/pages/CreateListingPage.jsx";
import MyListingsPage from "./features/listings/pages/MyListingsPage.jsx";
import UserDashboardPage from "./features/dashboard/pages/UserDashboardPage.jsx";
import NotificationsPage from "./features/notifications/pages/NotificationsPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketplacePage />} />
        <Route path="/auctions/:auctionId" element={<AuctionDetailsPage />} />
        <Route path="/listings/new" element={<CreateListingPage />} />
        <Route path="/my-listings" element={<MyListingsPage />} />
        <Route path="/dashboard" element={<UserDashboardPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
