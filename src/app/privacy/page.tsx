import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

// Bump this whenever the policy text below changes.
const LAST_UPDATED = "October 12, 2026";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `What ${SITE_NAME} collects, why, and how to have it removed.`,
};

const linkClass =
  "font-medium text-teal-900 underline decoration-teal-900/30 underline-offset-2 transition hover:decoration-teal-900 dark:text-amber-300 dark:decoration-amber-300/40 dark:hover:decoration-amber-300";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-50">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-slate-600 dark:text-slate-300 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  const contact = CONTACT_EMAIL ? (
    <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
      {CONTACT_EMAIL}
    </a>
  ) : null;

  return (
    <main className="flex-1 bg-stone-50 dark:bg-slate-950">
      <article className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-xs font-semibold tracking-[0.2em] text-orange-700 uppercase dark:text-orange-400">
          Privacy
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-balance text-slate-900 sm:text-4xl dark:text-slate-50">
          Privacy policy
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Last updated {LAST_UPDATED}
        </p>
        <p className="mt-6 text-slate-600 dark:text-slate-300">
          {SITE_NAME} is a small trip-planning site. We collect as little as
          we can, never sell your data, and don&apos;t show ads. This page
          explains what we do keep and why.
        </p>

        <Section title="Trips you plan">
          <p>
            Trips you create, your budget entries and your light/dark theme
            choice are saved only in your browser&apos;s local storage. They
            never reach our servers, and clearing your browser data removes
            them.
          </p>
        </Section>

        <Section title="Your account">
          <p>
            Signing in is optional and uses Google. When you sign in, Google
            shares your name, email address and profile picture with us. We
            use them to create your profile and never ask for or see your
            Google password.
          </p>
          <p>Once you&apos;re signed in, we store:</p>
          <ul>
            <li>your email address and the account ID our sign-in provider gives you</li>
            <li>
              profile details you choose to add, such as your name, bio,
              location, website and social handles
            </li>
            <li>
              an avatar if you upload one. Avatar images are served from a
              public link, so anyone who has that link can see the image.
            </li>
            <li>the packing lists you save to your profile</li>
          </ul>
        </Section>

        <Section title="Newsletter">
          <p>
            If you subscribe, we store your first name and email address so
            we can send you about one email a month. To unsubscribe and have
            your details deleted, contact us (see below).
          </p>
        </Section>

        <Section title="Analytics and cookies">
          <p>
            We use Google Analytics to see which pages are visited and how
            people find the site. It sets cookies and collects details such
            as the pages you view, your approximate location, your device and
            your browser. We use this only to improve {SITE_NAME}. You can
            opt out with Google&apos;s{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              browser add-on
            </a>{" "}
            or by blocking cookies. Read more in{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              how Google uses data from sites that use its services
            </a>
            .
          </p>
          <p>
            Signing in also sets cookies that keep your session active. These
            are needed for your account to work.
          </p>
        </Section>

        <Section title="Who handles your data">
          <p>We rely on a few providers to run the site:</p>
          <ul>
            <li>Supabase stores account, profile, packing-list and newsletter data</li>
            <li>Google handles sign-in and analytics</li>
            <li>Vercel hosts the site</li>
          </ul>
          <p>We don&apos;t sell or rent your personal information to anyone.</p>
        </Section>

        <Section title="Your choices">
          <p>
            You can edit your profile at any time in{" "}
            <Link href="/settings" className={linkClass}>
              Settings
            </Link>
            . You can also ask us to send you a copy of your data or to delete
            your account and everything linked to it.{" "}
            {contact ? (
              <>Email {contact} and we&apos;ll handle it within 30 days.</>
            ) : (
              <>Contact us and we&apos;ll handle it within 30 days.</>
            )}
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If this policy changes, we&apos;ll update it here and change the
            date at the top.
          </p>
        </Section>

        {contact && (
          <Section title="Contact">
            <p>Questions about this policy? Email {contact}.</p>
          </Section>
        )}
      </article>
    </main>
  );
}
