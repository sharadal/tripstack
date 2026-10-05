"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AVATAR_BUCKET } from "@/lib/profile";
import { AVATAR_TYPES, avatarFileError } from "@/lib/avatar";

export type ProfileActionState = { error?: string; success?: string };

// Editable text fields and their max lengths. These mirror the check
// constraints in supabase/profiles.sql so users get a friendly message
// instead of a database error.
const TEXT_FIELDS = {
  first_name: { label: "First name", max: 100 },
  last_name: { label: "Last name", max: 100 },
  bio: { label: "Bio", max: 500 },
  website: { label: "Website", max: 200 },
  instagram: { label: "Instagram", max: 100 },
  tiktok: { label: "TikTok", max: 100 },
  twitter: { label: "Twitter/X", max: 100 },
  youtube: { label: "YouTube", max: 200 },
  place: { label: "Place", max: 100 },
  country: { label: "Country", max: 100 },
} as const;

type TextField = keyof typeof TEXT_FIELDS;

// Accept "example.com" as well as full URLs, but only http(s).
function normaliseWebsite(value: string): string | undefined {
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withScheme);
    return url.hostname.includes(".") ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

// Storage path of a file in our avatars bucket, from its public URL.
function avatarPathFromUrl(url: string | null): string | null {
  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${AVATAR_BUCKET}/`;
  return url?.startsWith(prefix) ? url.slice(prefix.length) : null;
}

// Server Actions are public endpoints, so this re-checks the session itself.
// It uses the signed-in user's client (not the service-role key), so the
// profiles RLS policies and the avatars Storage policies both apply.
export async function updateProfile(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired — please sign in again." };

  const updates: Partial<Record<TextField | "avatar_url", string | null>> = {};

  for (const [field, { label, max }] of Object.entries(TEXT_FIELDS) as [
    TextField,
    (typeof TEXT_FIELDS)[TextField],
  ][]) {
    const value = String(formData.get(field) ?? "").trim();
    if (value.length > max) {
      return { error: `${label} must be ${max} characters or fewer.` };
    }
    updates[field] = value || null;
  }

  if (updates.website) {
    const website = normaliseWebsite(updates.website);
    if (!website) return { error: "Enter a valid website address." };
    updates.website = website;
  }

  // Optional new avatar. Stored under the user's own folder, which is the
  // only place the Storage policies let them write.
  const avatar = formData.get("avatar");
  let uploadedPath: string | null = null;
  let previousAvatarPath: string | null = null;

  if (avatar instanceof File && avatar.size > 0) {
    const fileError = avatarFileError(avatar);
    if (fileError) return { error: fileError };

    // A fresh file name each time, so browsers and CDNs never show a cached
    // old picture.
    uploadedPath = `${user.id}/avatar-${Date.now()}.${AVATAR_TYPES[avatar.type]}`;
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(uploadedPath, avatar, { contentType: avatar.type });
    if (uploadError) {
      return { error: "Couldn't upload your avatar — please try again." };
    }

    updates.avatar_url = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(uploadedPath).data.publicUrl;

    const { data: current } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    previousAvatarPath = avatarPathFromUrl(current?.avatar_url ?? null);
  }

  const { data: saved, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select("id");

  if (error || !saved?.length) {
    // Don't leave an orphaned upload behind if the profile didn't save.
    if (uploadedPath) {
      await supabase.storage.from(AVATAR_BUCKET).remove([uploadedPath]);
    }
    return {
      error: error
        ? "Couldn't save your profile — please try again."
        : "We couldn't find your profile — please refresh the page.",
    };
  }

  // Tidy up the replaced avatar. Only files in the user's own folder can be
  // removed (Storage policies), and a Google photo URL is never touched.
  if (previousAvatarPath && previousAvatarPath !== uploadedPath) {
    await supabase.storage.from(AVATAR_BUCKET).remove([previousAvatarPath]);
  }

  revalidatePath("/profile");
  revalidatePath("/settings");
  return {
    success: uploadedPath
      ? "Profile and avatar saved."
      : "Profile saved.",
  };
}
