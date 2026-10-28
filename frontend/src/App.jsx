import { BrowserRouter, Route, Routes } from "react-router-dom";

import MarketplacePage from "./features/auctions/pages/MarketplacePage.jsx";
import CreateListingPage from "./features/listings/pages/CreateListingPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketplacePage />} />
        <Route path="/listings/new" element={<CreateListingPage />} />
      </Routes>
    </BrowserRouter>
  );
}