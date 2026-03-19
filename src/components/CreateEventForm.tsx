"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";

export default function CreateEventForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [price, setPrice] = useState(0);
  const [totalSeats, setTotalSeats] = useState(100);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("pending");
    setErrorMessage(null);

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        location,
        startAt,
        endAt: endAt || null,
        priceCents: Math.round(price * 100),
        totalSeats
      })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ message: "Unknown error" }));
      setStatus("error");
      setErrorMessage(data.message ?? "Failed to create event.");
      return;
    }

    setStatus("success");
    setTitle("");
    setDescription("");
    setLocation("");
    setStartAt("");
    setEndAt("");
    setPrice(0);
    setTotalSeats(100);

    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Create an event</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Location</span>
          <input
            value={location}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            rows={3}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Start</span>
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setStartAt(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">End (optional)</span>
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEndAt(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Price ($)</span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={price}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(Number(e.target.value))}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Total seats</span>
          <input
            type="number"
            min={1}
            value={totalSeats}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTotalSeats(Number(e.target.value))}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </label>
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage ?? "Could not create event."}</p>
      )}
      {status === "success" && <p className="text-sm text-green-600">Event created successfully!</p>}
      <button
        type="submit"
        disabled={status === "pending"}
        className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "pending" ? "Creating…" : "Create event"}
      </button>
    </form>
  );
}
