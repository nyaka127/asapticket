export type EventWithStats = {
  id: string;
  title: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string | null;
  totalSeats: number;
  priceCents: number;
  availableSeats: number;
};
