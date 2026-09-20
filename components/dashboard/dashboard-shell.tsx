"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { Logo } from "@/components/branding/logo";
import {
  Menu,
  X,
  Bell,
  LogOut,
  ChevronRight,
  Shield,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  LucideIcon,
} from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/language-context";

export interface DashboardNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
}

export interface DashboardShellProps {
  roleName: string;
  roleBadgeText: string;
  roleBadgeColor?: "purple" | "blue" | "green" | "orange" | "slate";
  organizationName?: string;
  navItems: DashboardNavItem[];
  activeNavId: string;
  onNavChange: (id: string) => void;
  breadcrumbs?: { label: string; href?: string }[];
  notifications?: {
    id: string;
    title: string;
    description: string;
    time: string;
    type?: "info" | "warning" | "success";
    read?: boolean;
  }[];
  children: React.ReactNode;
}

export function DashboardShell({
  roleName,
  roleBadgeText,
  roleBadgeColor = "blue",
  organizationName,
  navItems,
  activeNavId,
  onNavChange,
  breadcrumbs,
  notifications = [
    {
      id: "1",
      title: "New grievance report assigned",
      description: "Case #JH-2026-B101 requires immediate triage.",
      time: "10m ago",
      type: "warning",
      read: false,
    },
    {
      id: "2",
      title: "SLA alert: 36 hours remaining",
      description: "Road repair notice near NH-33 junction.",
      time: "1h ago",
      type: "info",
      read: false,
    },
  ],
  children,
}: DashboardShellProps) {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const effectiveBreadcrumbs = breadcrumbs || [{ label: t("dashboard.home") || "Dashboard" }];

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const badgeColorMap = {
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    blue: "bg-blue-50 text-[#0F62B4] border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#111827]">
      {/* ───── TOP AUTHENTICATED HEADER (Responsive) ───── */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E5EA] shadow-xs">
        {/* 3px Tricolor Accent Line */}
        <div className="h-[3px] w-full flex" aria-hidden="true">
          <div className="h-full w-1/3 bg-[#FF9933]" />
          <div className="h-full w-1/3 bg-[#FFFFFF]" />
          <div className="h-full w-1/3 bg-[#138808]" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
            {/* Left: Mobile hamburger + Brand Identity / Header Breadcrumb */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0F62B4]"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              {/* Logo for Mobile/Tablet (<lg screens) */}
              <div className="flex lg:hidden items-center">
                <Logo variant="compact" size="xs" className="xs:hidden" />
                <Logo variant="full" size="sm" className="hidden xs:inline-flex" />
              </div>

              {/* Desktop Header Identity (Role + Organization) */}
              <div className="hidden lg:flex items-center gap-3 min-w-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColorMap[roleBadgeColor]}`}
                >
                  <Shield className="h-3 w-3" />
                  {roleBadgeText}
                </span>

                {organizationName && (
                  <span className="text-xs text-[#6B7280] font-medium truncate max-w-[320px]">
                    {organizationName}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Language Switcher + Notifications + Clerk User Profile */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Global Language Switcher */}
              <LanguageSwitcher variant="dashboard" />

              {/* Notifications Popover Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0F62B4] transition-colors"
                  aria-label="View notifications"
                  aria-expanded={notifOpen}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {notifOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotifOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#E2E5EA] bg-white shadow-xl z-50 p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E2E5EA]">
                        <h3 className="text-sm font-bold text-[#111827]">
                          {t("dashboard.notifications")} ({notifications.length})
                        </h3>
                        <span className="text-[11px] text-[#0F62B4] font-medium cursor-pointer hover:underline">
                          {t("dashboard.markAllRead")}
                        </span>
                      </div>
                      <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-lg border text-xs transition-colors ${
                              n.read
                                ? "border-transparent bg-transparent text-[#6B7280]"
                                : "border-blue-100 bg-blue-50/50 text-[#111827]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-semibold text-[13px]">
                                {n.title}
                              </span>
                              <span className="text-[10px] text-[#9CA3AF] shrink-0">
                                {n.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#4B5563] mt-1 leading-relaxed">
                              {n.description}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-[#E2E5EA] text-center">
                        <button
                          type="button"
                          onClick={() => {
                            onNavChange("notifications");
                            setNotifOpen(false);
                          }}
                          className="text-xs font-semibold text-[#0F62B4] hover:underline"
                        >
                          {t("dashboard.viewAllNotifications")}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Clerk User Profile Menu */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#E2E5EA]">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox:
                        "h-8 w-8 sm:h-9 sm:w-9 border border-[#E2E5EA]",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ───── MAIN BODY: SIDEBAR + CONTENT ───── */}
      <div className="flex-1 mx-auto w-full max-w-7xl flex relative">
        {/* Mobile/Tablet Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ───── RESPONSIVE SIDEBAR ───── */}
        <aside
          className={`fixed lg:sticky top-0 lg:top-[67px] bottom-0 left-0 z-50 lg:z-10 w-64 sm:w-72 bg-white lg:bg-transparent border-r lg:border-r-0 border-[#E2E5EA] flex flex-col h-full lg:h-[calc(100vh-67px)] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Desktop Sidebar Top Branded Header: [ JharSetu Logo ] */}
          <div className="hidden lg:flex flex-col p-4 border-b border-[#E2E5EA] bg-white rounded-t-2xl mt-4 mx-2 shadow-xs">
            <Logo variant="full" size="sm" />
            <div className="mt-2.5 pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#111827] truncate">{roleName}</span>
              <span className="text-[10px] text-[#6B7280] font-mono uppercase bg-[#F3F4F6] px-1.5 py-0.5 rounded">
                WORKSPACE
              </span>
            </div>
          </div>

          {/* Mobile Drawer Header with Logo & Close button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#E2E5EA] bg-[#F7F8FA]">
            <Logo variant="full" size="sm" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-md text-[#4B5563] hover:text-[#111827] hover:bg-[#E5E7EB]"
              aria-label="Close navigation drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4 px-3 sm:px-4 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
              {t("dashboard.workspaceNav")}
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left ${
                    isActive
                      ? "bg-[#0F62B4] text-white shadow-xs font-semibold"
                      : "text-[#4B5563] hover:text-[#111827] hover:bg-[#E5E7EB]/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? "text-white" : "text-[#6B7280]"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-[#4B5563]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer: Quick Citizen Link & Sign Out */}
          <div className="p-3 sm:p-4 border-t border-[#E2E5EA] space-y-2 bg-white/60 mx-2 mb-2 rounded-b-2xl">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#6B7280] hover:text-[#0F62B4] hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <span>{t("dashboard.publicPortal")}</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#9CA3AF]" />
            </Link>

            <SignOutButton>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{t("actions.signOut")}</span>
              </button>
            </SignOutButton>
          </div>
        </aside>

        {/* ───── CONTENT WORKSPACE AREA ───── */}
        <main
          id="main-content"
          className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6"
        >
          {/* Breadcrumbs Row */}
          {effectiveBreadcrumbs && effectiveBreadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-[#6B7280] flex-wrap"
            >
              {effectiveBreadcrumbs.map((crumb, idx) => {
                const isLast = idx === effectiveBreadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.label + idx}>
                    {idx > 0 && (
                      <ChevronRight className="h-3 w-3 text-[#9CA3AF] shrink-0" />
                    )}
                    {isLast || !crumb.href ? (
                      <span className="font-semibold text-[#111827] truncate">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="hover:text-[#0F62B4] transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}

          {/* Child Page Content */}
          {children}

          {/* Prototype Demo Disclaimer */}
          <footer className="mt-8 pt-4 border-t border-[#E2E5EA] text-center text-xs text-[#6B7280]">
            <p>
              {t("footer.disclaimer")}
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;
