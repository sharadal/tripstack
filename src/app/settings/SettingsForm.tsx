"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Profile } from "@/lib/profile";
import { avatarFileError } from "@/lib/avatar";
import ProfileAvatar from "@/components/ProfileAvatar";
import { updateProfile, type ProfileActionState } from "./actions";

const inputClass =
  "w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-500";

const labelClass =
  "text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400";

const sectionClass =
  "mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900";

const initialState: ProfileActionState = {};

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  maxLength,
  type = "text",
}: {
  name: keyof Profile;
  label: string;
  defaultValue: string | null;
  placeholder?: string;
  maxLength: number;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`mt-2 ${inputClass}`}
      />
    </div>
  );
}

export default function SettingsForm({
  profile,
  email,
  displayName,
}: {
  profile: Profile;
  email: string;
  displayName: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  // Bumped after a successful save to remount (and so empty) the file input.
  const [fileInputKey, setFileInputKey] = useState(0);

  // Free the object URL behind the preview when it's replaced or unmounted.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // After a successful save the page re-renders with the new avatar, so
  // drop the local preview and the chosen file. Adjusting state during
  // render, as in SubscriberRow, rather than in an effect.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) {
      setPreview(null);
      setFileInputKey((key) => key + 1);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreview(null);
      setFileError(null);
      return;
    }
    const error = avatarFileError(file);
    if (error) {
      event.target.value = "";
      setPreview(null);
      setFileError(error);
      return;
    }
    setFileError(null);
    setPreview(URL.createObjectURL(file));
  };

  const clearSelectedFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreview(null);
    setFileError(null);
  };

  // Submitting through the action ourselves (instead of <form action>)
  // stops React from resetting the fields after each save, so a validation
  // error doesn't wipe what the user typed.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={sectionClass}>
        <h2 className={labelClass}>Avatar</h2>
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
          <ProfileAvatar src={preview ?? profile.avatar_url} name={displayName} />
          <div className="text-center sm:text-left">
            <label
              htmlFor="avatar"
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-orange-400 dark:hover:text-orange-300"
            >
              {profile.avatar_url ? "Replace photo" : "Upload photo"}
            </label>
            <input
              key={fileInputKey}
              ref={fileInputRef}
              id="avatar"
              name="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="sr-only"
            />
            {preview && (
              <button
                type="button"
                onClick={clearSelectedFile}
                className="ml-3 text-sm font-medium text-slate-500 hover:text-teal-900 dark:text-slate-400 dark:hover:text-amber-300"
              >
                Cancel
              </button>
            )}
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {preview
                ? "Preview — click Save changes to use this photo."
                : "JPEG, PNG or WebP, up to 2 MB."}
            </p>
            {fileError && (
              <p role="alert" className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                {fileError}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className={labelClass}>About you</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <Field name="first_name" label="First name" defaultValue={profile.first_name} maxLength={100} />
          <Field name="last_name" label="Last name" defaultValue={profile.last_name} maxLength={100} />
          <div className="sm:col-span-2">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              readOnly
              disabled
              className={`mt-2 ${inputClass} cursor-not-allowed bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400`}
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Comes from your Google account, so it can&apos;t be changed here.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="bio" className={labelClass}>
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              maxLength={500}
              defaultValue={profile.bio ?? ""}
              placeholder="A few words about how you like to travel."
              className={`mt-2 ${inputClass} rounded-2xl`}
            />
          </div>
          <Field name="place" label="Place" defaultValue={profile.place} placeholder="Dublin" maxLength={100} />
          <Field name="country" label="Country" defaultValue={profile.country} placeholder="Ireland" maxLength={100} />
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className={labelClass}>Links</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field name="website" label="Website" defaultValue={profile.website} placeholder="example.com" maxLength={200} />
          </div>
          <Field name="instagram" label="Instagram" defaultValue={profile.instagram} placeholder="@yourname" maxLength={100} />
          <Field name="tiktok" label="TikTok" defaultValue={profile.tiktok} placeholder="@yourname" maxLength={100} />
          <Field name="twitter" label="Twitter/X" defaultValue={profile.twitter} placeholder="@yourname" maxLength={100} />
          <Field name="youtube" label="YouTube" defaultValue={profile.youtube} placeholder="@yourchannel" maxLength={200} />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        <div aria-live="polite">
          {!pending && state.success && (
            <p className="rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
              {state.success}
            </p>
          )}
          {!pending && state.error && (
            <p role="alert" className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {state.error}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
