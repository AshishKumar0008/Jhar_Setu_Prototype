"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TricolorLine } from "@/components/patterns/tricolor-line";
import { Logo } from "@/components/branding/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  PanelLeftOpen,
  PanelLeftClose,
  LogIn,
} from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";

/**
 * Authenticated roles per feature-spec 06-auth-and-dashboards.md.
 * Citizens are NOT authenticated — they are always "public".
 * Role-switching is only available on /dev/shell-testbench.
 */
export type AuthRole =
  | "ADMIN"
  | "DEPARTMENT_OFFICER"
  | "INNOVATION_CELL"
  | "UNIVERSITY"
  | "INDUSTRY";

/**
 * @deprecated Use AuthRole instead.
 * Kept for backwards-compatibility with role-sidebar.tsx and dev testbench
 */
export type UserRole =
  | AuthRole
  | "citizen"
  | "reviewer"
  | "department_officer"
  | "government"
  | "university"
  | "industry_csr"
  | "admin"
  | "assisted_operator";

export interface AppNavbarProps {
  isPublic?: boolean;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  currentLang?: "en" | "hi";
  onLanguageChange?: (lang: "en" | "hi") => void;
  pageTitle?: React.ReactNode;
  className?: string;
}

export function AppNavbar({
  isPublic,
  sidebarOpen = false,
  onToggleSidebar,
  pageTitle,
  className = "",
}: AppNavbarProps) {
  const { t } = useLanguage();

  // Show sidebar toggle only for authenticated internal routes
  const showSidebarToggle = !isPublic;

  return (
    <header className={`sticky top-0 z-40 w-full bg-white border-b border-[#E2E5EA] ${className}`}>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-2.5 sm:px-6 lg:px-8 gap-1.5 sm:gap-4">
        {/* Left Section: Sidebar Toggle (internal routes only) + Global Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
          {showSidebarToggle && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-md border border-[#E2E5EA] text-[#111827] hover:bg-[#F7F8FA] hover:text-[#0F62B4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F62B4]"
              aria-label={sidebarOpen ? "Close role sidebar" : "Open role sidebar"}
              title={sidebarOpen ? "Close role navigation" : "Open role navigation"}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4 sm:h-5 sm:w-5 text-[#0F62B4]" />
              ) : (
                <PanelLeftOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[#6B7280]" />
              )}
            </button>
          )}

          {/* Reusable JharSetu Logo */}
          <Logo variant="full" size="sm" className="min-w-0" />
        </div>

        {/* Center Section: Page title / breadcrumb */}
        <div className="flex-1 shrink min-w-0 flex justify-center items-center px-1 sm:px-2">
          {pageTitle ? (
            <div className="text-xs sm:text-sm font-semibold text-[#111827] truncate max-w-[120px] sm:max-w-md">
              {pageTitle}
            </div>
          ) : null}
        </div>

        {/* Right Section: Language switcher + Clerk auth control */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Centralized Language Switcher */}
          <LanguageSwitcher variant="navbar" />

          {/* Clerk Auth Control */}
          <Show when="signed-in">
            {/* Signed-in: show Clerk UserButton only */}
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8 sm:h-9 sm:w-9 border border-[#E2E5EA]",
                },
              }}
            />
          </Show>

          <Show when="signed-out">
            {/* Signed-out: Officer Sign In button */}
            <Link href="/sign-in">
              <Button
                id="navbar-officer-sign-in"
                variant="outline"
                size="sm"
                className="min-h-[30px] sm:min-h-[36px] border-[#E2E5EA] text-[#111827] hover:bg-[#F7F8FA] hover:text-[#0F62B4] font-medium text-xs px-2 sm:px-3"
              >
                <LogIn className="h-3.5 w-3.5 sm:mr-1 text-[#0F62B4] shrink-0" />
                <span className="hidden sm:inline">{t("nav.officerSignIn")}</span>
                <span className="sm:hidden">{t("nav.officerSignIn")}</span>
              </Button>
            </Link>
          </Show>
        </div>
      </div>

      {/* 3px Tricolor Accent Line */}
      <TricolorLine />
    </header>
  );
}

export default AppNavbar;
