import {
  EPIPHAN_LOGO_VIEWBOX,
  EPIPHAN_WORDMARK_PATHS,
  EPIPHAN_MARK_PATH,
} from "./epiphan-logo-paths";

interface EpiphanLogoProps {
  height?: number;
  /** "dark" = green mark + charcoal wordmark (light backgrounds); "white" = all white (dark backgrounds). */
  variant?: "dark" | "white";
  className?: string;
}

/** Official Epiphan Video logo (from the Epiphan Brand kit), rendered inline for the web. */
export function EpiphanLogo({ height = 28, variant = "dark", className }: EpiphanLogoProps) {
  const wordmark = variant === "white" ? "#ffffff" : "#414042";
  const mark = variant === "white" ? "#ffffff" : "#8CBE3F";
  return (
    <svg
      viewBox={EPIPHAN_LOGO_VIEWBOX}
      height={height}
      role="img"
      aria-label="Epiphan Video"
      className={className}
      style={{ width: "auto", display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {EPIPHAN_WORDMARK_PATHS.map((d, i) => (
        <path key={i} d={d} fill={wordmark} />
      ))}
      <path d={EPIPHAN_MARK_PATH} fill={mark} fillRule="evenodd" />
    </svg>
  );
}
