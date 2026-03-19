"use client";

import { useRouter } from "next/navigation";
import CreateEventForm from "@/components/CreateEventForm";
import DeleteEventButton from "@/components/DeleteEventButton";

export type AdminEvent = {
  id: string;
  title: string;
  startAt: string;
  totalSeats: number;
  priceCents: number;
};

export default function AdminEventList({ events }: { events: AdminEvent[] }) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <CreateEventForm onCreated={() => router.refresh()} />

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Events</h2>
        {events.length === 0 ? (
          <p className="mt-4 text-slate-600">No events created yet.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">{event.title}</p>
                  <p className="text-sm text-slate-600">
                    Starts {new Date(event.startAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600">
                    Seats: {event.totalSeats} • Price: ${(event.priceCents / 100).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <DeleteEventButton eventId={event.id} onDeleted={() => router.refresh()} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
