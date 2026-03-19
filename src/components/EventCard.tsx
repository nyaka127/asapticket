import Link from "next/link";
import { EventWithStats } from "@/types";

export default function EventCard({ event }: { event: EventWithStats }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold">{event.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{event.description}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1 text-sm text-slate-600">
          <div>
            <span className="font-medium text-slate-800">Location:</span> {event.location}
          </div>
          <div>
            <span className="font-medium text-slate-800">Starts:</span>{" "}
            {new Date(event.startAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium text-slate-800">Price:</span> ${(event.priceCents / 100).toFixed(2)}
          </div>
          <div>
            <span className="font-medium text-slate-800">Available:</span> {event.availableSeats}
          </div>
        </div>
        <Link
          href={`/events/${event.id}`}
          className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          View
        </Link>
      </div>
    </div>
  );
}
