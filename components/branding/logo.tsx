import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface LogoProps {
  /**
   * Display variant:
   * - "full": Logo icon + JharSetu / झारसेतु brand typography + subtext
   * - "compact": Logo icon only
   * Defaults to "full".
   */
  variant?: "full" | "compact";
  /**
   * Size presets:
   * - "xs": Compact header icon (28px height)
   * - "sm": Small navbar / left-rail (34px height)
   * - "md": Standard header / sidebar (42px height)
   * - "lg": Prominent hero / landing (54px height)
   * - "xl": Modal / receipt display (64px height)
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Destination URL when clicked. Set to `false` to render as a non-clickable element.
   * Defaults to "/".
   */
  href?: string | false;
  /**
   * Whether to display the subtext ("Societal Innovation Collaboration Portal") in "full" variant.
   * Defaults to true.
   */
  showSubtext?: boolean;
  /**
   * Custom subtext override.
   */
  subtext?: string;
  /**
   * Custom alt text for the logo image.
   * Defaults to "JharSetu — Societal Innovation Collaboration Portal".
   */
  alt?: string;
  /**
   * Additional container className.
   */
  className?: string;
  /**
   * Additional image className.
   */
  imageClassName?: string;
  /**
   * Whether Next.js should load the logo image with high priority.
   */
  priority?: boolean;
}

const SIZE_MAP = {
  xs: {
    imgWidth: 75,
    imgHeight: 28,
    imgClass: "h-7 w-auto",
    titleClass: "text-sm",
    hindiClass: "text-xs",
    subtextClass: "text-[9px]",
    gapClass: "gap-1.5",
  },
  sm: {
    imgWidth: 90,
    imgHeight: 34,
    imgClass: "h-8 sm:h-8.5 w-auto",
    titleClass: "text-base",
    hindiClass: "text-xs sm:text-sm",
    subtextClass: "text-[10px]",
    gapClass: "gap-2",
  },
  md: {
    imgWidth: 112,
    imgHeight: 42,
    imgClass: "h-9 sm:h-10.5 w-auto",
    titleClass: "text-base sm:text-lg",
    hindiClass: "text-xs sm:text-sm",
    subtextClass: "text-[11px]",
    gapClass: "gap-2.5 sm:gap-3",
  },
  lg: {
    imgWidth: 144,
    imgHeight: 54,
    imgClass: "h-12 sm:h-13.5 w-auto",
    titleClass: "text-xl sm:text-2xl",
    hindiClass: "text-sm sm:text-base",
    subtextClass: "text-xs",
    gapClass: "gap-3 sm:gap-3.5",
  },
  xl: {
    imgWidth: 170,
    imgHeight: 64,
    imgClass: "h-16 w-auto",
    titleClass: "text-2xl sm:text-3xl",
    hindiClass: "text-base sm:text-lg",
    subtextClass: "text-sm",
    gapClass: "gap-4",
  },
};

export function Logo({
  variant = "full",
  size = "md",
  href = "/",
  showSubtext = true,
  subtext = "Societal Innovation Collaboration Portal",
  alt = "JharSetu — Societal Innovation Collaboration Portal",
  className = "",
  imageClassName = "",
  priority = true,
}: LogoProps) {
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;
  const isCompact = variant === "compact";

  const content = (
    <div
      className={`inline-flex items-center ${
        isCompact ? "" : sizeConfig.gapClass
      } select-none ${className}`}
    >
      {/* ── Official JharSetu Logo Graphic ── */}
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/brand/jharsetu-logo.png"
          alt={alt}
          width={sizeConfig.imgWidth}
          height={sizeConfig.imgHeight}
          priority={priority}
          className={`object-contain ${sizeConfig.imgClass} ${imageClassName}`}
          style={{ width: "auto" }}
        />
      </div>

      {/* ── Brand Typography (Full Variant) ── */}
      {!isCompact && (
        <div className="flex flex-col min-w-0 justify-center text-left">
          <div className="flex items-baseline gap-1.5 sm:gap-2 leading-none">
            <span
              className={`font-bold tracking-tight text-[#111827] ${sizeConfig.titleClass}`}
            >
              JharSetu
            </span>
            <span
              className={`font-normal text-[#6B7280] ${sizeConfig.hindiClass}`}
            >
              झारसेतु
            </span>
          </div>
          {showSubtext && subtext && (
            <span
              className={`text-[#6B7280] font-medium tracking-wide truncate mt-0.5 leading-tight hidden sm:block ${sizeConfig.subtextClass}`}
            >
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );

  // If href is specified, render accessible Link
  if (href !== false && href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center rounded-md p-0.5 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F62B4] focus-visible:ring-offset-2"
        aria-label={alt}
        title="JharSetu Home"
      >
        {content}
      </Link>
    );
  }

  // Non-clickable container
  return content;
}

export default Logo;
