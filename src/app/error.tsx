"use client"; // Error boundaries must be Client Components

import ErrorContent from "@/components/ErrorContent";

// Catches unexpected errors in any page below the root layout. The header,
// footer and theme still render around it.
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <ErrorContent error={error} retry={retry} />;
}
