import { ArrowLeft, PackagePlus, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../../components/Navbar.jsx";
import ListingForm from "../components/ListingForm.jsx";

export default function CreateListingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-900">
      <Navbar
        onSearch={() => navigate("/")}
      />

      <main className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to marketplace
        </button>

        <header className="mb-8">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <PackagePlus size={24} />
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
                Seller workspace
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Create a listing
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Give your item a second life. Add clear photos and
                details so fellow students can decide whether to bid.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-indigo-600"
            />

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Keep campus transactions safe
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Describe the item's actual condition and choose a suitable
                public campus pickup point.
              </p>
            </div>
          </div>
        </header>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <ListingForm />
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          Frontend prototype · Your listing will not be published until
          backend integration is implemented.
        </p>
      </main>
    </div>
  );
}