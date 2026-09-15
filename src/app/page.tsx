type Trip = {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  activities: string[];
  budget: string;
  travelStyle: string;
};

const trips: Trip[] = [
  {
    id: 1,
    destination: "Lisbon, Portugal",
    startDate: "2026-10-12",
    endDate: "2026-10-19",
    activities: ["Walking tour", "Belem Tower", "Day trip to Sintra"],
    budget: "$1,200",
    travelStyle: "City break",
  },
  {
    id: 2,
    destination: "Kyoto, Japan",
    startDate: "2027-03-02",
    endDate: "2027-03-10",
    activities: ["Fushimi Inari shrine", "Tea ceremony", "Bamboo grove hike"],
    budget: "$2,800",
    travelStyle: "Culture",
  },
  {
    id: 3,
    destination: "Cape Town, South Africa",
    startDate: "2027-01-15",
    endDate: "2027-01-22",
    activities: ["Table Mountain", "Boulders Beach penguins", "Wine tasting"],
    budget: "$2,100",
    travelStyle: "Adventure",
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(dateString: string) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  return Math.round((target.getTime() - today.getTime()) / msPerDay);
}

function CountdownBadge({ startDate }: { startDate: string }) {
  const days = daysUntil(startDate);

  if (days < 0) {
    return (
      <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
        Past trip
      </span>
    );
  }

  if (days === 0) {
    return (
      <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
        Starts today
      </span>
    );
  }

  return (
    <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
      In {days} day{days === 1 ? "" : "s"}
    </span>
  );
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
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  {trip.destination}
                </h3>
                <CountdownBadge startDate={trip.startDate} />
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                  {trip.travelStyle}
                </span>
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Budget: {trip.budget}
                </span>
              </div>

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
