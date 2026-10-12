import { TripDetailSkeleton } from "@/components/Skeletons";

// Every trip page is looked up per request, so show the skeleton straight
// away on navigation instead of leaving the previous page on screen.
export default function Loading() {
  return <TripDetailSkeleton />;
}
