export type Trip = {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  activities: string[];
  packingList?: string[];
  notes?: string;
  budget: number;
  spent: number;
  travelStyle: string;
  image: string;
};

export const trips: Trip[] = [
  {
    id: 1,
    destination: "Lisbon, Portugal",
    startDate: "2026-10-12",
    endDate: "2026-10-19",
    description:
      "Cobbled streets, vintage trams and pastéis de nata — a slow week wandering the Alfama hills.",
    activities: ["Walking tour", "Belem Tower", "Day trip to Sintra"],
    budget: 1200,
    spent: 300,
    travelStyle: "City break",
    image: "/images/trip-lisbon.jpg",
  },
  {
    id: 2,
    destination: "Kyoto, Japan",
    startDate: "2027-03-02",
    endDate: "2027-03-10",
    description:
      "Vermilion shrine gates, a quiet tea ceremony and a walk through the Arashiyama bamboo grove.",
    activities: ["Fushimi Inari shrine", "Tea ceremony", "Bamboo grove hike"],
    budget: 2800,
    spent: 500,
    travelStyle: "Culture",
    image: "/images/trip-kyoto.jpg",
  },
  {
    id: 3,
    destination: "Cape Town, South Africa",
    startDate: "2027-01-15",
    endDate: "2027-01-22",
    description:
      "Table Mountain views, penguins at Boulders Beach and an afternoon of Cape wine tasting.",
    activities: ["Table Mountain", "Boulders Beach penguins", "Wine tasting"],
    budget: 2100,
    spent: 400,
    travelStyle: "Adventure",
    image: "/images/trip-capetown.jpg",
  },
];

export function getTripById(id: number): Trip | undefined {
  return trips.find((trip) => trip.id === id);
}

export type NewTripInput = {
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  travelStyle: string;
  budget: number;
  image?: string;
  description: string;
  activities: string[];
  packingList: string[];
  notes: string;
};

export function addTrip(input: NewTripInput): Trip {
  const nextId = trips.reduce((max, trip) => Math.max(max, trip.id), 0) + 1;

  const trip: Trip = {
    id: nextId,
    destination: `${input.destination}, ${input.country}`,
    startDate: input.startDate,
    endDate: input.endDate,
    description: input.description,
    activities: input.activities,
    packingList: input.packingList,
    notes: input.notes,
    budget: input.budget,
    spent: 0,
    travelStyle: input.travelStyle,
    image: input.image || "/images/hero-travel.jpg",
  };

  trips.push(trip);
  return trip;
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysUntil(dateString: string) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  return Math.round((target.getTime() - today.getTime()) / msPerDay);
}

export function getNights(trip: Trip) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  return Math.round((end.getTime() - start.getTime()) / msPerDay);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function nextDeparture() {
  return trips
    .filter((trip) => daysUntil(trip.startDate) >= 0)
    .sort((a, b) => daysUntil(a.startDate) - daysUntil(b.startDate))[0];
}
