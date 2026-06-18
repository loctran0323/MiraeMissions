import Link from "next/link";

// Mirae Asset wordmark + program label. The mark is the signature Mirae orange
// square with a subtle gradient; the wordmark sits in the display typeface.
export function Logo({
  href = "/dashboard",
  subtitle = "Summer Missions",
  inverted = false,
}: {
  href?: string;
  subtitle?: string;
  inverted?: boolean;
}) {
  return (
    <Link href={href} className="group flex items-center gap-3">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-mirae-gradient shadow-glow">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 19V7l6 6 3-3 3 3 6-6v12"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={`font-display text-[15px] font-extrabold tracking-tight ${
            inverted ? "text-white" : "text-navy-900"
          }`}
        >
          MIRAE ASSET
        </span>
        <span
          className={`text-[11px] font-medium tracking-wide ${
            inverted ? "text-white/60" : "text-navy-400"
          }`}
        >
          {subtitle}
        </span>
      </span>
    </Link>
  );
}
