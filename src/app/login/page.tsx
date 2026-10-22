import type { Metadata } from "next";
import { Suspense } from "react";
import { HeartPulse, LineChart, ShieldCheck, Users } from "lucide-react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

const FEATURES = [
  { icon: Users, text: "Manage doctors and their patients in one place" },
  { icon: LineChart, text: "Live analytics and trends at a glance" },
  { icon: ShieldCheck, text: "Secure, role-based access" },
];

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white lg:flex">
        <div
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
            <HeartPulse className="h-6 w-6" />
          </span>
          <span className="text-xl font-semibold tracking-tight">
            Doctor Tracker
          </span>
        </div>
        <div className="relative">
          <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
            Care coordination, simplified.
          </h1>
          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-slate-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-[18px] w-[18px] text-brand-300" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-slate-500">
          © {new Date().getFullYear()} Doctor Tracker
        </p>
      </section>

      <section className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <HeartPulse className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold">Doctor Tracker</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Sign in to access the admin portal.
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
