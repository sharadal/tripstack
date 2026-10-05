// Round avatar image, or the first letter of the name when there's no
// picture. A plain <img> (like the header avatar) since avatars come from
// Supabase Storage or Google's image host.
export default function ProfileAvatar({
  src,
  name,
  className = "h-24 w-24 text-3xl",
}: {
  src: string | null | undefined;
  name: string;
  className?: string;
}) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      className={`${className} rounded-full object-cover shadow-sm ring-4 ring-white dark:ring-slate-900`}
    />
  ) : (
    <span
      className={`${className} flex items-center justify-center rounded-full bg-gradient-to-br from-teal-900 to-teal-950 font-serif font-bold text-white shadow-sm ring-4 ring-white dark:ring-slate-900`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
