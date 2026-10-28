
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, authError, refreshUser } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking your session...
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-5 text-center">
        <p role="alert" className="text-sm text-red-700">
          Could not verify your session: {authError}
        </p>
        <button
          type="button"
          onClick={() => void refreshUser()}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}
