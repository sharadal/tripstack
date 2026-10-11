import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import sharp from "sharp";
import { getTripById, getNights } from "@/lib/trips";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { PlaneIcon } from "@/components/icons";

// Wide 1200x630 share card for a trip: the destination photo cropped to fit,
// the destination name and TripStack branding. Trip photos are often
// portrait, which link previews would otherwise crop to a thin strip.
export const alt = "Trip preview card from TripStack";
export const size = { width: 1200, height: 630 };
// JPEG rather than ImageResponse's default PNG: a photo card is ~1-2 MB as
// PNG but well under 200 KB as JPEG, which WhatsApp and slow links handle
// far better.
export const contentType = "image/jpeg";

// Showcase trips are editable in Supabase, so render per request like the
// trip page itself. Platforms cache the image on their side anyway.
export const dynamic = "force-dynamic";

const FALLBACK_IMAGE = "/images/hero-travel.jpg";

// Width of the centre column that survives a square (630x630) crop.
const SAFE_WIDTH = 600;

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

// Returns the photo as a data URI, or null if it can't be loaded (the card
// then falls back to a plain gradient). Site images are read from /public;
// if that copy isn't available (e.g. not bundled with the function) they are
// fetched from the site instead. Remote URLs are fetched directly.
async function loadPhoto(src: string): Promise<string | null> {
  try {
    if (src.startsWith("/")) {
      const mime = MIME_TYPES[extname(src).toLowerCase()];
      const relative = normalize(src).replace(/^\/+/, "");
      if (mime && !relative.startsWith("..")) {
        try {
          const data = await readFile(join(process.cwd(), "public", relative));
          return `data:${mime};base64,${data.toString("base64")}`;
        } catch {
          // Fall through to fetching it from the deployed site.
        }
      }
    }

    const res = await fetch(new URL(src, SITE_URL));
    const mime = res.headers.get("content-type") ?? "";
    if (!res.ok || !/^image\/(jpeg|png)$/.test(mime)) return null;
    const data = Buffer.from(await res.arrayBuffer());
    return `data:${mime};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  // Only public showcase trips get their own card. Personal trips live in
  // the visitor's browser, so they (and invalid IDs) get a generic card.
  const trip = Number.isFinite(numericId)
    ? await getTripById(numericId).catch(() => undefined)
    : undefined;

  const photo = await loadPhoto(trip?.image ?? FALLBACK_IMAGE);
  const heading = trip?.destination ?? "Plan your next adventure";
  // Kept short so it stays readable when phones show the card ~1/3 size.
  const details = trip
    ? `${getNights(trip)} nights · ${trip.travelStyle}`
    : "Trips, budgets & packing lists";
  const headingSize = heading.length <= 12 ? 84 : heading.length <= 18 ? 66 : 56;

  // Everything sits centred inside a SAFE_WIDTH column so the card still
  // reads when an app crops it to a centre square (e.g. WhatsApp's compact
  // preview), and text sizes are large enough to survive phone-size display.
  const card = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#042f2e",
          backgroundImage: "linear-gradient(135deg, #134e4a, #042f2e)",
          color: "white",
        }}
      >
        {photo && (
          <img
            src={photo}
            alt=""
            width={size.width}
            height={size.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            backgroundImage:
              "radial-gradient(circle at center, rgba(2, 6, 23, 0.72) 0%, rgba(2, 6, 23, 0.5) 55%, rgba(2, 6, 23, 0.35) 100%)",
            textShadow: "0 2px 16px rgba(2, 6, 23, 0.55)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundImage: "linear-gradient(135deg, #134e4a, #042f2e)",
                border: "2px solid rgba(255, 255, 255, 0.25)",
              }}
            >
              {/* Same mark as the site header logo. */}
              <div style={{ display: "flex", width: 28, height: 28 }}>
                <PlaneIcon />
              </div>
            </div>
            <div style={{ fontSize: 38 }}>{SITE_NAME}</div>
          </div>

          <div
            style={{
              width: 72,
              height: 6,
              borderRadius: 3,
              backgroundColor: "#fcd34d",
              margin: "30px 0 26px",
            }}
          />

          <div
            style={{
              maxWidth: SAFE_WIDTH,
              fontSize: headingSize,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              justifyContent: "center",
              textWrap: "balance",
            }}
          >
            {heading}
          </div>

          <div
            style={{
              maxWidth: SAFE_WIDTH,
              marginTop: 22,
              fontSize: 40,
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            {details}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );

  const jpeg = await sharp(Buffer.from(await card.arrayBuffer()))
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": contentType,
      // Let Vercel's CDN reuse a card for an hour so crawlers don't
      // re-render it on every hit; trip edits still show up within the hour.
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
