"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UtilityBar } from "@/components/shell/utility-bar";
import { AppNavbar } from "@/components/shell/app-navbar";
import { Phone } from "lucide-react";

export interface PublicLayoutProps {
  children: React.ReactNode;
  showUtilityBar?: boolean;
  showFooter?: boolean;
  pageTitle?: React.ReactNode;
  className?: string;
}

export function PublicLayout({
  children,
  showUtilityBar = true,
  showFooter = true,
  pageTitle,
  className = "",
}: PublicLayoutProps) {
  const [lang, setLang] = useState<"en" | "hi">("en");

  return (
    <div className={`min-h-screen flex flex-col bg-[var(--bg-base,#F7F8FA)] text-[var(--text-primary,#111827)] ${className}`}>
      {/* Utility Bar (GIGW pattern) */}
      {showUtilityBar && (
        <UtilityBar currentLang={lang} onLanguageChange={setLang} />
      )}

      {/* Public App Navbar with Global JharSetu Logo */}
      <AppNavbar
        isPublic
        currentLang={lang}
        onLanguageChange={setLang}
        pageTitle={pageTitle}
      />

      {/* Main Page Canvas */}
      <div className="flex-1 flex flex-col">{children}</div>

      {/* Prototype Civic Footer */}
      {showFooter && (
        <footer className="w-full bg-[var(--brand-navy,#0F1F3D)] text-white mt-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Platform Identity */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold">
                  JharSetu <span className="font-normal text-white/70">| झारसेतु</span>
                </h3>
                <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
                  Societal Innovation Collaboration Portal
                </p>
                <p className="text-sm text-white/70 leading-relaxed">
                  {lang === "en"
                    ? "A prototype platform connecting citizens, public problem management, universities, innovation teams, and industry partners."
                    : "नागरिकों, सार्वजनिक समस्या प्रबंधन, विश्वविद्यालयों, नवाचार टीमों और उद्योग भागीदारों को जोड़ने वाला एक प्रोटोटाइप मंच।"}
                </p>
              </div>

              {/* Helplines */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                  {lang === "en" ? "Sample Helplines" : "नमूना हेल्पलाइन"}
                </h4>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-white/50 shrink-0" />
                    <span>
                      <strong className="text-white">181</strong> — Civic Grievance
                      Desk
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-white/50 shrink-0" />
                    <span>
                      <strong className="text-white">1912</strong> — Electricity
                      Support Desk
                    </span>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                  {lang === "en" ? "Quick Links" : "त्वरित लिंक"}
                </h4>
                <div className="flex flex-col gap-1.5 text-sm text-white/70">
                  <Link
                    href="/report/new"
                    className="hover:text-white transition-colors"
                  >
                    {lang === "en" ? "Report a Problem" : "समस्या दर्ज करें"}
                  </Link>
                  <Link
                    href="/track"
                    className="hover:text-white transition-colors"
                  >
                    {lang === "en" ? "Track My Report" : "शिकायत स्थिति ट्रैक करें"}
                  </Link>
                  <Link
                    href="/sign-in"
                    className="hover:text-white transition-colors"
                  >
                    {lang === "en" ? "Officer Sign In" : "अधिकारी प्रवेश"}
                  </Link>
                </div>
              </div>
            </div>

            {/* Prototype Disclaimer & Attribution */}
            <div className="mt-8 pt-6 border-t border-white/20 text-center text-xs text-white/60 space-y-1">
              <p className="font-medium text-amber-300/90">
                Prototype — Not an official government website. • प्रोटोटाइप — यह कोई आधिकारिक सरकारी वेबसाइट नहीं है।
              </p>
              <p className="text-white/40 text-[11px]">
                © 2026 JharSetu Prototype • Designed for SIH 26043
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default PublicLayout;
