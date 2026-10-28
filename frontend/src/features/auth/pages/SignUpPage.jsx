
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, UserPlus } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import AuthInput from "../components/AuthInput.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import useAuth from "../hooks/useAuth.js";
import { validateSignUp } from "../utils/authValidation.js";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp, isAuthenticated, isLoading } = useAuth();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    const validationErrors = validateSignUp(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setFormError("");

    try {
      await signUp(values);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setFormError(error.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      heading="Create your account"
      subtitle="Join your campus community and start buying or selling."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            id="name"
            label="Full name"
            value={values.name}
            onChange={updateField}
            placeholder="Enter your full name"
            autoComplete="name"
            error={errors.name}
          />

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
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={errors.password}
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirm password"
            value={values.confirmPassword}
            onChange={updateField}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />

          <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
            Use 8–128 characters, including at least one letter and one number.
            Your password is stored as a secure one-way hash.
          </div>

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
            <UserPlus size={17} />
            {loading ? "Creating account..." : "Create account"}
            {!loading && <ArrowRight size={16} />}
          </button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-5 text-center">
        <p className="text-sm text-slate-500">
          Already registered?{" "}
          <Link
            to="/signin"
            className="font-semibold text-indigo-700 hover:text-indigo-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
