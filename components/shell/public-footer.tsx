"use client";

import React from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export function PublicFooter() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-[var(--brand-navy,#0F1F3D)] text-white mt-auto border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Platform Identity */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold">
              JharSetu <span className="font-normal text-white/70">| झारसेतु</span>
            </h3>
            <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">
              {t("footer.portalName")}
            </p>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Helplines */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              {t("common.support")}
            </h4>
            <div className="space-y-2.5 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-white/50 shrink-0" />
                <span>
                  <strong className="text-white">181</strong> — {t("common.publicGrievance")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-white/50 shrink-0" />
                <span>
                  <strong className="text-white">1912</strong> — {t("common.electricityComplaint")}
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              {t("footer.quickLinks")}
            </h4>
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <Link href="/report/new" className="hover:text-white transition-colors">
                {t("nav.reportProblem")}
              </Link>
              <Link href="/track" className="hover:text-white transition-colors">
                {t("nav.trackReport")}
              </Link>
              <Link href="/challenges" className="hover:text-white transition-colors">
                {t("nav.challenges")}
              </Link>
              <Link href="/sign-in" className="hover:text-white transition-colors">
                {t("nav.officerSignIn")}
              </Link>
            </div>
          </div>
        </div>

        {/* Prototype Disclaimer & Attribution */}
        <div className="mt-10 pt-6 border-t border-white/15 text-center text-xs text-white/60 space-y-1.5">
          <p className="font-medium text-amber-300/90">
            {t("footer.disclaimer")}
          </p>
          <p className="text-white/40 text-[11px]">
            {t("footer.sihBadge")}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
