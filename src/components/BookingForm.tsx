"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";

type Props = {
  eventId: string;
  maxQuantity: number;
  priceCents: number;
  onBooked?: () => void;
};

export default function BookingForm({ eventId, maxQuantity, priceCents, onBooked }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const total = (quantity * priceCents) / 100;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("pending");
    setErrorMessage(null);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, quantity })
    });

    if (!res.ok) {
      setStatus("error");
      const data = await res.json().catch(() => ({ message: "Unknown error" }));
      setErrorMessage(data.message ?? "Something went wrong");
      return;
    }

    setStatus("success");
    setQuantity(1);
    onBooked?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Book tickets</h2>
      <div className="grid gap-3">
        <label className="block text-sm font-medium text-slate-700">
          Quantity
          <select
            value={quantity}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setQuantity(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>
        </label>
        <div className="text-sm text-slate-700">
          Total: <span className="font-semibold">${total.toFixed(2)}</span>
        </div>
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage ?? "Failed to create booking."}</p>
      )}
      {status === "success" && <p className="text-sm text-green-600">Booking confirmed!</p>}
      <button
        type="submit"
        disabled={status === "pending"}
        className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "pending" ? "Booking…" : "Book now"}
      </button>
    </form>
  );
}
