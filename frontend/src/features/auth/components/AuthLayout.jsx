
import { ShieldCheck } from "lucide-react";
import AuthBrand from "./AuthBrand.jsx";

export default function AuthLayout({ children, heading, subtitle }) {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <AuthBrand />
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-md">
          <div className="mb-7 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
              <ShieldCheck size={25} />
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {heading}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {subtitle}
            </p>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            {children}
          </section>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            Campus Auction · Student marketplace
          </p>
        </div>
      </div>
    </main>
  );
}
