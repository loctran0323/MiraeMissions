import Link from "next/link";

// Official Mirae Asset Securities wordmark (navy + orange flame), served from
// /public/brand. On dark backgrounds we render a clean white version via filter.
const LOGO_SRC = "/brand/mirae-logo-white.png";
const RATIO = 174 / 55;

export function Logo({
  href = "/",
  height = 30,
  inverted = false,
  withProgram = true,
}: {
  href?: string;
  height?: number;
  inverted?: boolean;
  withProgram?: boolean;
}) {
  return (
    <Link href={href} className="group flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_SRC}
        alt="Mirae Asset Securities"
        height={height}
        width={Math.round(height * RATIO)}
        style={{ height, width: "auto" }}
        className={inverted ? "[filter:brightness(0)_invert(1)]" : undefined}
      />
      {withProgram && (
        <>
          <span
            className={`h-5 w-px ${inverted ? "bg-white/25" : "bg-line"}`}
            aria-hidden
          />
          <span
            className={`text-[12px] font-semibold tracking-tight ${
              inverted ? "text-white/70" : "text-ink-500"
            }`}
          >
            Summer Missions
          </span>
        </>
      )}
    </Link>
  );
}

// Standalone logo image (no program label) — for centerpiece/hero usage.
export function MiraeMark({
  size = 40,
  inverted = false,
}: {
  size?: number;
  inverted?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="Mirae Asset Securities"
      style={{ height: size, width: "auto" }}
      className={inverted ? "[filter:brightness(0)_invert(1)]" : undefined}
    />
  );
}
