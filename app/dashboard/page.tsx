
import ApplicationAnalytics from "@/components/application-analytics";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddApplicationForm from "@/components/add-application-form";
import ApplicationList from "@/components/application-list";

async function DashboardContent() {
  const supabase = await createClient();

  // Check logged-in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  // Get applications from Supabase
  const { data, error } = await supabase
    .from("applications")
    .select("id, company, role, status, notes, applied_at")
    .eq("user_id", user.id)
    .order("applied_at", { ascending: false });

  const applications = data ?? [];

  // Dashboard statistics
  const stats = [
    {
      title: "Total Applications",
      value: applications.length,
      symbol: "Σ",
      color: "text-blue-600",
      background: "bg-blue-50",
    },
    {
      title: "Interviews",
      value: applications.filter(
        (a) => a.status === "Interview"
      ).length,
      symbol: "I",
      color: "text-violet-600",
      background: "bg-violet-50",
    },
    {
      title: "Offers",
      value: applications.filter(
        (a) => a.status === "Offer"
      ).length,
      symbol: "✓",
      color: "text-emerald-600",
      background: "bg-emerald-50",
    },
    {
      title: "Rejected",
      value: applications.filter(
        (a) => a.status === "Rejected"
      ).length,
      symbol: "×",
      color: "text-rose-600",
      background: "bg-rose-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <div className="flex min-h-screen">

        {/* LEFT SIDEBAR */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-6">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
              IT
            </div>

            <div>
              <h1 className="text-xl font-bold">
                InternTrack
              </h1>
              <p className="text-xs text-slate-400">
                Career Dashboard
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Workspace
            </p>

            <a
              href="/dashboard"
              className="bg-blue-50 text-blue-700 rounded-lg px-4 py-3 font-semibold"
            >
              Dashboard
            </a>

            <a
              href="#add-application"
              className="text-slate-600 hover:bg-slate-100 rounded-lg px-4 py-3"
            >
              Add Application
            </a>

            <a
              href="#applications"
              className="text-slate-600 hover:bg-slate-100 rounded-lg px-4 py-3"
            >
              My Applications
            </a>
          </nav>

          {/* Sidebar bottom */}
          <div className="mt-auto pt-8">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-sm font-semibold">
                Your Career Journey
              </p>

              <p className="text-xs text-slate-500 mt-2">
                Stay organized and keep track of
                every internship opportunity.
              </p>
            </div>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1">

          {/* TOP HEADER */}
          <header className="bg-white border-b border-slate-200 px-5 md:px-10 py-5">

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
                  Your Workspace
                </p>

                <h2 className="text-2xl font-bold">
                  Dashboard Overview
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold uppercase">
                  {user.email?.charAt(0) ?? "U"}
                </div>

                <div className="hidden sm:block">
                  <p className="text-xs text-slate-400">
                    Signed in as
                  </p>

                  <p className="text-sm font-medium break-all">
                    {user.email}
                  </p>
                </div>
              </div>

            </div>

          </header>

          <div className="max-w-7xl mx-auto p-5 md:p-10">

            {/* WELCOME SECTION */}
            <section className="mb-8">

              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back!
              </h2>

              <p className="text-slate-500 mt-2">
                Here is an overview of your internship journey.
              </p>

              {/* Mobile navigation */}
              <div className="flex md:hidden gap-3 mt-5 flex-wrap">
                <a
                  href="#add-application"
                  className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium"
                >
                  Add Application
                </a>

                <a
                  href="#applications"
                  className="border border-slate-200 bg-white rounded-lg px-4 py-2 text-sm font-medium"
                >
                  View Applications
                </a>
              </div>

            </section>

            {/* STATISTICS */}
            <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">

              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div
                      className={`${stat.background} ${stat.color} w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold`}
                    >
                      {stat.symbol}
                    </div>
                  </div>

                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>

                  <h3 className="text-4xl font-bold mt-2">
                    {stat.value}
                  </h3>
                </div>
              ))}

            </section>
                     
            {/* APPLICATION ANALYTICS */}
            <ApplicationAnalytics
              statuses={applications.map((app) => app.status)}
             />

          
            {/* ADD APPLICATION */}
            <div id="add-application" className="scroll-mt-6">
              <AddApplicationForm userId={user.id} />
            </div>

            {/* APPLICATION LIST */}
            <section
              id="applications"
              className="bg-white border border-slate-200 rounded-2xl p-5 md:p-8 scroll-mt-6"
            >
              <div className="mb-7">
                <h2 className="text-2xl font-bold">
                  My Applications
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Search, manage and track your applications
                  in one place.
                </p>
              </div>

              {error ? (
                <p className="text-red-600 bg-red-50 rounded-lg p-4">
                  Could not load applications: {error.message}
                </p>
              ) : (
                <ApplicationList applications={applications} />
              )}

            </section>

            {/* FOOTER */}
            <footer className="text-center mt-10 text-sm text-slate-400">
              InternTrack — Your internship journey, organized.
            </footer>

          </div>

        </main>

      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 p-10">
          Loading your dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
