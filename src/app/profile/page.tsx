import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile, profileDisplayName } from "@/lib/profile";
import ProfileAvatar from "@/components/ProfileAvatar";
import { MapPinIcon } from "@/components/icons";

// Per-user page -- always rendered fresh for whoever is signed in.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your profile — TripStack",
};

const labelClass =
  "text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400";

export default async function ProfilePage() {
  const { user, profile, error } = await getCurrentProfile();
  if (!user) redirect("/login?next=/profile");

  const name = profileDisplayName(profile, user);
  const avatar =
    profile?.avatar_url ??
    user.user_metadata?.avatar_url ??
    user.user_metadata?.picture;

  return (
    <main className="flex-1 bg-stone-50 dark:bg-slate-950">
      <section className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-xs font-semibold tracking-[0.2em] text-orange-700 uppercase dark:text-orange-400">
          Your profile
        </p>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            Couldn&apos;t load your profile details — please try again.
          </p>
        )}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
            <ProfileAvatar src={avatar} name={name} />
            <div className="mt-4 min-w-0 sm:mt-0">
              <h1 className="font-serif text-3xl font-bold break-words text-slate-900 dark:text-slate-50">
                {name}
              </h1>
              <p className="mt-1 truncate text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
              {(profile?.place || profile?.country) && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                  <MapPinIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  {[profile.place, profile.country].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </div>

          <dl className="mt-8 grid gap-6 border-t border-slate-100 pt-8 sm:grid-cols-2 dark:border-slate-800">
            <div className="sm:col-span-2">
              <dt className={labelClass}>About me</dt>
              <dd className="mt-2 whitespace-pre-line text-slate-700 dark:text-slate-200">
                {profile?.bio || (
                  <span className="text-slate-400 dark:text-slate-500">
                    No bio yet.
                  </span>
                )}
              </dd>
            </div>
            <ProfileField label="Place" value={profile?.place} />
            <ProfileField label="Country" value={profile?.country} />
          </dl>
        </div>

        <Link
          href="/settings"
          className="mt-8 inline-flex items-center justify-center gap-1.5 rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md"
        >
          Edit profile
        </Link>
      </section>
    </main>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <dt className={labelClass}>{label}</dt>
      <dd className="mt-2 text-slate-700 dark:text-slate-200">
        {value || (
          <span className="text-slate-400 dark:text-slate-500">Not set</span>
        )}
      </dd>
    </div>
  );
}
