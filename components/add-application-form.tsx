
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Status = "Applied" | "Interview" | "Offer" | "Rejected";

export default function AddApplicationForm({
  userId,
}: {
  userId: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Status>("Applied");
  const [appliedAt, setAppliedAt] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setMessage("");
    setErrorMessage("");

    if (!company.trim() || !role.trim()) {
      setErrorMessage("Please enter a company and role.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("applications")
      .insert({
        user_id: userId,
        company: company.trim(),
        role: role.trim(),
        status,
        notes: notes.trim(),
        ...(appliedAt ? { applied_at: appliedAt } : {}),
      });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setMessage("Application added successfully!");

      setCompany("");
      setRole("");
      setStatus("Applied");
      setAppliedAt("");
      setNotes("");

      router.refresh();
    }

    setLoading(false);
  }

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";

  return (
    <section className="mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}
      <div className="border-b border-slate-100 px-6 py-5 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-2xl font-bold text-blue-600">
            +
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Add New Application
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep track of your next career opportunity.
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6 md:p-8"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* COMPANY */}
          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Company Name *
            </label>

            <input
              id="company"
              type="text"
              required
              maxLength={120}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Microsoft"
              className={inputStyle}
            />
          </div>

          {/* ROLE */}
          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Internship Role *
            </label>

            <input
              id="role"
              type="text"
              required
              maxLength={120}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Full-Stack Developer Intern"
              className={inputStyle}
            />
          </div>

          {/* STATUS */}
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Application Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as Status)
              }
              className={inputStyle}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* DATE */}
          <div>
            <label
              htmlFor="applied-at"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Application Date
            </label>

            <input
              id="applied-at"
              type="date"
              value={appliedAt}
              onChange={(e) => setAppliedAt(e.target.value)}
              className={inputStyle}
            />

            <p className="mt-1 text-xs text-slate-400">
              Leave blank to use today's date.
            </p>
          </div>
        </div>

        {/* NOTES */}
        <div>
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Additional Notes
          </label>

          <textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Interview details, application link, or anything you want to remember..."
            className={inputStyle}
          />

          <p className="mt-2 text-xs text-slate-400">
            Optional — add anything useful about this application.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {/* SUBMIT */}
        <div className="flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            Fields marked * are required.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving Application..." : "+ Add Application"}
          </button>
        </div>
      </form>
    </section>
  );
}
