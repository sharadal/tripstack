type Trip = {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  activities: string[];
};

const trips: Trip[] = [
  {
    id: 1,
    destination: "Lisbon, Portugal",
    startDate: "2026-10-12",
    endDate: "2026-10-19",
    activities: ["Walking tour", "Belem Tower", "Day trip to Sintra"],
  },
  {
    id: 2,
    destination: "Kyoto, Japan",
    startDate: "2027-03-02",
    endDate: "2027-03-10",
    activities: ["Fushimi Inari shrine", "Tea ceremony", "Bamboo grove hike"],
  },
  {
    id: 3,
    destination: "Cape Town, South Africa",
    startDate: "2027-01-15",
    endDate: "2027-01-22",
    activities: ["Table Mountain", "Boulders Beach penguins", "Wine tasting"],
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Home() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-slate-900 px-6 py-16 text-center text-white">
        <h1 className="text-4xl font-bold sm:text-5xl">TripStack</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-300">
          Organise every trip in one place — destinations, dates, and
          activities, all together.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
          Upcoming trips
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <article
              key={trip.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {trip.destination}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              </p>

              <ul className="mt-4 space-y-1 text-sm text-slate-600">
                {trip.activities.map((activity) => (
                  <li key={activity} className="flex items-start gap-2">
                    <span aria-hidden="true">•</span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
