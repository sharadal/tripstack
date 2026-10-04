import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAdminStatus } from "@/lib/admin";
import { PlaneIcon, UsersIcon } from "@/components/icons";
import AddSubscriberForm from "./AddSubscriberForm";
import SubscriberRow from "./SubscriberRow";

// Always read live data — this page is a private admin view, not a
// candidate for build-time prerendering.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Subscribers — Admin — TripStack",
};

export default async function AdminSubscribersPage() {
  // The admin client bypasses RLS, so only allowlisted admins get past
  // this point.
  const { user, isAdmin } = await getAdminStatus();
  if (!user) redirect("/login?next=/admin/subscribers");
  if (!isAdmin) return <NoAccess />;

  const { data: subscribers, error } = await supabaseAdmin
    .from("subscribers")
    .select("id, first_name, email, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="flex-1 bg-stone-50 dark:bg-slate-950">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-900 to-teal-950 text-white shadow-sm">
          <UsersIcon className="h-5 w-5" />
        </span>
        <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-orange-700 uppercase dark:text-orange-400">
          Admin
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-50">
          Newsletter subscribers
        </h1>
        <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-300">
          Add, edit, or remove people on the TripStack mailing list.
        </p>

        <div className="mt-8">
          <AddSubscriberForm />
        </div>

        <div className="mt-10 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {error ? (
            <p className="p-8 text-sm text-red-600 dark:text-red-400">
              Couldn&apos;t load subscribers: {error.message}
            </p>
          ) : subscribers && subscribers.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs font-semibold tracking-[0.1em] text-slate-500 uppercase dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">First name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Subscribed</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subscribers.map((subscriber) => (
                  <SubscriberRow key={subscriber.id} subscriber={subscriber} />
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-8 text-sm text-slate-500 dark:text-slate-400">
              No subscribers yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function NoAccess() {
  return (
    <main className="flex-1 bg-stone-50 dark:bg-slate-950">
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-900 to-teal-950 text-white shadow-sm">
          <UsersIcon className="h-6 w-6" />
        </span>
        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-orange-700 uppercase dark:text-orange-400">
          Admin
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-50">
          You don&apos;t have access to this page
        </h1>
        <p className="mt-3 max-w-md text-slate-600 dark:text-slate-300">
          This area is only for TripStack admins.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-1.5 rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md"
        >
          <PlaneIcon className="h-3.5 w-3.5 -rotate-45" />
          Back to home
        </Link>
      </section>
    </main>
  );
}
