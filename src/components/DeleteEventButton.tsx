"use client";

import { useState } from "react";

export default function DeleteEventButton({
  eventId,
  onDeleted,
}: {
  eventId: string;
  onDeleted: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  async function handleDelete() {
    if (!confirm("Delete this event? This cannot be undone.")) {
      return;
    }

    setStatus("pending");
    const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    if (!res.ok) {
      setStatus("error");
      return;
    }

    setStatus("success");
    onDeleted();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={status === "pending"}
      className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {status === "pending" ? "Deleting…" : "Delete"}
    </button>
  );
}
