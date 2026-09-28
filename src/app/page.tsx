import { getTrips } from "@/lib/trips";
import HomeContent from "@/components/HomeContent";

export default async function Home() {
  const trips = await getTrips();
  return <HomeContent demoTrips={trips} />;
}
