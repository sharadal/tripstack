export type Trip = {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  activities: string[];
  budget: number;
  spent: number;
  travelStyle: string;
};

export const trips: Trip[] = [
  {
    id: 1,
    destination: "Lisbon, Portugal",
    startDate: "2026-10-12",
    endDate: "2026-10-19",
    activities: ["Walking tour", "Belem Tower", "Day trip to Sintra"],
    budget: 1200,
    spent: 300,
    travelStyle: "City break",
  },
  {
    id: 2,
    destination: "Kyoto, Japan",
    startDate: "2027-03-02",
    endDate: "2027-03-10",
    activities: ["Fushimi Inari shrine", "Tea ceremony", "Bamboo grove hike"],
    budget: 2800,
    spent: 500,
    travelStyle: "Culture",
  },
  {
    id: 3,
    destination: "Cape Town, South Africa",
    startDate: "2027-01-15",
    endDate: "2027-01-22",
    activities: ["Table Mountain", "Boulders Beach penguins", "Wine tasting"],
    budget: 2100,
    spent: 400,
    travelStyle: "Adventure",
  },
];

export function getTripById(id: number): Trip | undefined {
  return trips.find((trip) => trip.id === id);
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

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
