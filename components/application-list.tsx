
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Application = {
  id: string;
  company: string;
  role: string;
  status: string;
  notes: string | null;
  applied_at: string | null;
};

const statuses = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

const statusColors: Record<string, string> = {
  Applied: "bg-blue-50 text-blue-700",
  Interview: "bg-purple-50 text-purple-700",
  Offer: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
};

export default function ApplicationList({
  applications,
}: {
  applications: Application[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");

  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Search and filter
  const filtered = applications.filter((app) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      `${app.company} ${app.role}`
        .toLowerCase()
        .includes(query);

    const matchesFilter =
      filter === "All" || app.status === filter;

    return matchesSearch && matchesFilter;
  });

  // Open edit form
  function startEdit(app: Application) {
    setEditingId(app.id);
    setCompany(app.company);
    setRole(app.role);
    setStatus(app.status);
    setNotes(app.notes ?? "");
    setErrorMessage("");
  }

  // Save edited application
  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingId || busy) return;

    if (!company.trim() || !role.trim()) {
      setErrorMessage("Company and role are required.");
      return;
    }

    setBusy(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("applications")
      .update({
        company: company.trim(),
        role: role.trim(),
        status,
        notes: notes.trim(),
      })
      .eq("id", editingId)
      .select("id");

    if (error || !data?.length) {
      setErrorMessage(
        error?.message ?? "Could not update application."
      );
    } else {
      setEditingId(null);
      router.refresh();
    }

    setBusy(false);
  }

  // Delete application
  async function deleteApplication(id: string) {
    if (busy) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    setBusy(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id)
      .select("id");

    if (error || !data?.length) {
      setErrorMessage(
        error?.message ?? "Could not delete application."
      );
    } else {
      if (editingId === id) setEditingId(null);
      router.refresh();
    }

    setBusy(false);
  }

  return (
    <div className="space-y-6">

      {/* SEARCH AND FILTER */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          aria-label="Search applications"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-0 border border-slate-200 rounded-xl px-4 py-3 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-3 bg-white text-slate-900"
        >
          <option value="All">All Statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* RESULTS COUNT */}
      <p className="text-sm text-slate-500">
        Showing {filtered.length} of {applications.length} applications
      </p>

      {errorMessage && (
        <p role="alert" className="text-red-600">
          {errorMessage}
        </p>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-500">
            No applications found.
          </p>
        </div>
      )}

      {/* APPLICATION CARDS */}
      <div className="grid gap-4">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
          >
            {editingId === app.id ? (

              /* EDIT FORM */
              <form onSubmit={saveEdit} className="space-y-4">
                <h3 className="font-bold text-lg">
                  Edit Application
                </h3>

                <input
                  required
                  maxLength={120}
                  aria-label="Edit company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 bg-white text-slate-900"
                />

                <input
                  required
                  maxLength={120}
                  aria-label="Edit internship role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 bg-white text-slate-900"
                />

                <select
                  aria-label="Edit application status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 bg-white text-slate-900"
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <textarea
                  aria-label="Edit application notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 bg-white text-slate-900"
                  rows={3}
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={busy}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                  >
                    {busy ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setEditingId(null)}
                    className="border border-slate-200 px-5 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>

            ) : (

              /* NORMAL APPLICATION CARD */
              <>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                  {/* COMPANY DETAILS */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold uppercase">
                      {app.company.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-bold break-words">
                        {app.company}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1 break-words">
                        {app.role}
                      </p>
                    </div>
                  </div>

                  {/* STATUS BADGE */}
                  <span
                    className={`self-start px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[app.status] ??
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* NOTES */}
                {app.notes && (
                  <p className="text-sm text-slate-500 mt-5">
                    {app.notes}
                  </p>
                )}

                {/* FOOTER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 mt-5 pt-4">

                  <p className="text-xs text-slate-400">
                    Applied: {app.applied_at ?? "Not specified"}
                  </p>

                  <div className="flex gap-2">
                    <button
                      disabled={busy}
                      onClick={() => startEdit(app)}
                      className="border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Edit
                    </button>

                    <button
                      disabled={busy}
                      onClick={() => deleteApplication(app.id)}
                      className="border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
