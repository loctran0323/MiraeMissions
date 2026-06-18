"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Mission } from "@/lib/types";
import { Button, Pill } from "@/components/ui";

const DELIVERABLE_OPTIONS = [
  "Photo + memo",
  "Photo / video + memo",
  "Photo / video",
  "Memo (+ optional photo)",
  "Memo",
];

export function MissionManager({ missions }: { missions: Mission[] }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [deliverable, setDeliverable] = useState(DELIVERABLE_OPTIONS[0]);
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !shortDescription.trim()) {
      setError("Title and description are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          short_description: shortDescription,
          deliverable_type: deliverable,
          instructions,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add mission.");
        setSaving(false);
        return;
      }
      setTitle("");
      setShortDescription("");
      setInstructions("");
      setDeliverable(DELIVERABLE_OPTIONS[0]);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(m: Mission) {
    if (
      !window.confirm(
        `Delete "${m.title}"? This also removes all intern submissions for it. This cannot be undone.`,
      )
    )
      return;
    setDeletingId(m.id);
    try {
      const res = await fetch(`/api/admin/missions/${m.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete mission.");
        return;
      }
      router.refresh();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      {/* Existing missions */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-500">
            Current missions ({missions.length})
          </h2>
        </div>
        {missions.length === 0 ? (
          <div className="rounded-lg border border-line bg-white px-6 py-16 text-center">
            <p className="font-display text-lg font-semibold text-ink-900">
              No missions yet
            </p>
            <p className="mt-2 text-sm text-ink-500">
              Add your first mission with the form.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
            {missions.map((m, i) => (
              <div key={m.id} className="flex items-center gap-4 px-5 py-4">
                <span className="w-8 shrink-0 font-display text-sm font-bold text-mirae">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-[15px] font-semibold text-ink-900">
                    {m.title}
                  </h3>
                  <p className="mt-0.5 truncate text-sm text-ink-500">
                    {m.short_description}
                  </p>
                </div>
                <Pill className="hidden md:inline-flex">
                  {m.deliverable_type}
                </Pill>
                <button
                  onClick={() => onDelete(m)}
                  disabled={deletingId === m.id}
                  className="shrink-0 rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 disabled:opacity-50"
                >
                  {deletingId === m.id ? "Removing…" : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add mission */}
      <form onSubmit={onAdd} className="card p-6 lg:sticky lg:top-28">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Add a mission
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          New missions appear at the end of the list.
        </p>

        {error && (
          <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="m-title">
              Title
            </label>
            <input
              id="m-title"
              className="input"
              placeholder="e.g. Shadow a trader"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="m-desc">
              Short description
            </label>
            <input
              id="m-desc"
              className="input"
              placeholder="One line shown on the mission card."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="m-deliverable">
              Deliverable type
            </label>
            <select
              id="m-deliverable"
              className="input"
              value={deliverable}
              onChange={(e) => setDeliverable(e.target.value)}
            >
              {DELIVERABLE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="m-instructions">
              Instructions (one per line, optional)
            </label>
            <textarea
              id="m-instructions"
              className="input"
              rows={4}
              placeholder={"What should they do?\nWhat proof should they submit?"}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" disabled={saving} className="mt-6 w-full">
          {saving ? "Adding…" : "Add mission"}
        </Button>
      </form>
    </div>
  );
}
