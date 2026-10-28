
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, LogIn } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import AuthInput from "../components/AuthInput.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import useAuth from "../hooks/useAuth.js";
import { validateSignIn } from "../utils/authValidation.js";

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated, isLoading } = useAuth();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  function updateField(event) {
    const { name, value } = event.target;

    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateSignIn(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setFormError("");

    try {
      await signIn(values);

      const destination = location.state?.from || "/dashboard";
      navigate(destination, { replace: true });
    } catch (error) {
      setFormError(error.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      heading="Welcome back"
      subtitle="Sign in to continue to your campus marketplace."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="email"
          label="Email address"
          type="email"
          value={values.email}
          onChange={updateField}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
        />

        <PasswordInput
          id="password"
          label="Password"
          value={values.password}
          onChange={updateField}
          error={errors.password}
        />

        {formError && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogIn size={17} />
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight size={16} />}
        </button>

      </form>

      <div className="mt-6 border-t border-slate-100 pt-5 text-center">
        <p className="text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-700 hover:text-indigo-800"
          >
            Create account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
