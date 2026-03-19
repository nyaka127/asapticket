"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

type UserProfile = {
  name: string;
  email: string;
  phoneNumber?: string | null;
  notifyEmail: boolean;
  notifySms: boolean;
  notifyWhatsApp: boolean;
};

export default function UserProfileForm() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setError("Failed to load profile"));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    setStatus("pending");
    setError(null);

    const res = await fetch("/api/user/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.name,
        phoneNumber: user.phoneNumber,
        notifyEmail: user.notifyEmail,
        notifySms: user.notifySms,
        notifyWhatsApp: user.notifyWhatsApp
      })
    });

    if (!res.ok) {
      setStatus("error");
      setError("Failed to update profile");
      return;
    }

    setStatus("success");
  }

  if (!user) {
    return <p className="text-slate-600">Loading profile…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Profile</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            value={user.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, name: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            value={user.email}
            disabled
            className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Phone (E.164)</span>
          <input
            value={user.phoneNumber ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, phoneNumber: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </label>

        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={user.notifyEmail}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, notifyEmail: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sm text-slate-700">Email notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={user.notifySms}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, notifySms: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sm text-slate-700">SMS notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={user.notifyWhatsApp}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, notifyWhatsApp: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sm text-slate-700">WhatsApp notifications</span>
          </label>
        </div>
      </div>

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
      {status === "success" && <p className="text-sm text-green-600">Profile updated.</p>}

      <button
        type="submit"
        className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
      >
        Save changes
      </button>
    </form>
  );
}
