
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./features/auth/context/AuthContext.jsx";
import ProtectedRoute from "./features/auth/components/ProtectedRoute.jsx";
import SignInPage from "./features/auth/pages/SignInPage.jsx";
import SignUpPage from "./features/auth/pages/SignUpPage.jsx";

import MarketplacePage from "./features/auctions/pages/MarketplacePage.jsx";
import AuctionDetailsPage from "./features/auctions/pages/AuctionDetailsPage.jsx";

import CreateListingPage from "./features/listings/pages/CreateListingPage.jsx";
import MyListingsPage from "./features/listings/pages/MyListingsPage.jsx";

import UserDashboardPage from "./features/dashboard/pages/UserDashboardPage.jsx";
import NotificationsPage from "./features/notifications/pages/NotificationsPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<MarketplacePage />} />
          <Route
            path="/auctions/:auctionId"
            element={<AuctionDetailsPage />}
          />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Pages requiring a signed-in account */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/listings/new" element={<CreateListingPage />} />
            <Route path="/my-listings" element={<MyListingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-slate-900">
                    Page not found
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    The page you're looking for doesn't exist.
                  </p>
                  <a
                    href="/"
                    className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Back to marketplace
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
