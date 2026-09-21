import { trips } from "@/lib/trips";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return <HomeContent demoTrips={trips} />;
}
