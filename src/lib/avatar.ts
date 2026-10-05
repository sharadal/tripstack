// Avatar upload rules, shared by the Settings form (to fail fast in the
// browser) and its Server Action (the real check). They match the limits on
// the `avatars` Storage bucket in supabase/profiles.sql.

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export const AVATAR_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function avatarFileError(file: { type: string; size: number }) {
  if (!(file.type in AVATAR_TYPES)) {
    return "Avatar must be a JPEG, PNG or WebP image.";
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return "Avatar must be 2 MB or smaller.";
  }
  return undefined;
}
