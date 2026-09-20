"use client";

import React, { useEffect } from "react";
import { UserRole } from "./app-navbar";
import { Logo } from "@/components/branding/logo";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  X,
  LayoutDashboard,
  Inbox,
  FileCheck2,
  Layers,
  Route,
  Sparkles,
  Award,
  FileText,
  GitFork,
  History,
  Briefcase,
  CheckCircle2,
  CheckSquare,
  FolderKanban,
  GraduationCap,
  Handshake,
  ShieldCheck,
  BarChart3,
  Compass,
  Users,
  Bell,
  Building2,
  Landmark,
  GitMerge,
  Cpu,
  Database,
  LucideIcon,
} from "lucide-react";

export interface NavItemConfig {
  id: string;
  label: string;
  hindiLabel?: string;
  icon: LucideIcon;
  badge?: string | number;
}

export const ROLE_NAV_CONFIGS: Partial<
  Record<Exclude<UserRole, "citizen" | "assisted_operator">, NavItemConfig[]>
> = {
  reviewer: [
    { id: "dashboard", label: "Dashboard", hindiLabel: "डैशबोर्ड", icon: LayoutDashboard },
    { id: "review-queue", label: "Review queue", hindiLabel: "समीक्षा कतार", icon: Inbox, badge: "3" },
    { id: "report-decision-card", label: "Report decision card", hindiLabel: "निर्णय पत्रक", icon: FileCheck2 },
    { id: "cluster-explorer", label: "Cluster explorer", hindiLabel: "समूह अन्वेषक", icon: Layers },
    { id: "authority-routing", label: "Authority routing", hindiLabel: "प्राधिकरण मार्ग", icon: Route },
    { id: "path-c-candidates", label: "Path C candidates", hindiLabel: "पथ C प्रत्याशी", icon: Sparkles },
    { id: "innovation-gap-certs", label: "Innovation Gap Certificates", hindiLabel: "नवाचार अंतराल प्रमाण पत्र", icon: Award },
    { id: "challenge-passport-editor", label: "Challenge Passport editor", hindiLabel: "चुनौती पासपोर्ट संपादक", icon: FileText },
    { id: "matching-runs", label: "Matching runs", hindiLabel: "मिलान सत्र", icon: GitFork },
    { id: "audit-view", label: "Audit view", hindiLabel: "ऑडिट अवलोकन", icon: History },
  ],
  DEPARTMENT_OFFICER: [
    { id: "overview", label: "Overview", hindiLabel: "अवलोकन", icon: LayoutDashboard },
    { id: "new-reports", label: "New Reports", hindiLabel: "नई रिपोर्ट", icon: Inbox, badge: "1" },
    { id: "active-cases", label: "Active Cases", hindiLabel: "सक्रिय मामले", icon: FileCheck2, badge: "2" },
    { id: "clusters", label: "Clusters", hindiLabel: "क्लस्टर", icon: Layers },
    { id: "resolved", label: "Resolved", hindiLabel: "समाधान किए गए", icon: CheckCircle2 },
    { id: "analytics", label: "Analytics", hindiLabel: "विश्लेषण", icon: BarChart3 },
    { id: "notifications", label: "Notifications", hindiLabel: "सूचनाएं", icon: Bell, badge: "2" },
  ],
  INNOVATION_CELL: [
    { id: "overview", label: "Overview", hindiLabel: "अवलोकन", icon: LayoutDashboard },
    { id: "candidates", label: "Innovation Candidates", hindiLabel: "नवाचार उम्मीदवार", icon: Sparkles, badge: "2" },
    { id: "challenges", label: "Challenges", hindiLabel: "चुनौतियां", icon: Award, badge: "1" },
    { id: "university-matching", label: "University Matching", hindiLabel: "विश्वविद्यालय मिलान", icon: GitMerge },
    { id: "projects", label: "Projects", hindiLabel: "परियोजनाएं", icon: FolderKanban },
    { id: "partnerships", label: "Industry Partnerships", hindiLabel: "उद्योग साझेदारियां", icon: Building2 },
    { id: "pilot-readiness", label: "Pilot Readiness", hindiLabel: "पायलट तैयारी", icon: CheckCircle2 },
    { id: "audit-timeline", label: "Audit Timeline", hindiLabel: "ऑडिट समयरेखा", icon: History },
    { id: "notifications", label: "Notifications", hindiLabel: "सूचनाएं", icon: Bell, badge: "3" },
  ],
  UNIVERSITY: [
    { id: "overview", label: "Overview", hindiLabel: "अवलोकन", icon: LayoutDashboard },
    { id: "assigned-challenges", label: "Assigned Challenges", hindiLabel: "सौंपी गई चुनौतियां", icon: Compass, badge: "1" },
    { id: "my-projects", label: "My Projects", hindiLabel: "मेरी परियोजनाएं", icon: FolderKanban, badge: "2" },
    { id: "teams", label: "Teams", hindiLabel: "टीमें", icon: Users },
    { id: "faculty-mentors", label: "Faculty Mentors", hindiLabel: "संकाय मार्गदर्शक", icon: GraduationCap },
    { id: "proposals", label: "Proposals", hindiLabel: "प्रस्ताव", icon: FileText },
    { id: "milestones", label: "Milestones", hindiLabel: "मील के पत्थर", icon: CheckSquare },
    { id: "industry-support", label: "Industry Support", hindiLabel: "उद्योग सहायता", icon: Handshake, badge: "1" },
    { id: "notifications", label: "Notifications", hindiLabel: "सूचनाएं", icon: Bell, badge: "2" },
  ],
  INDUSTRY: [
    { id: "overview", label: "Overview", hindiLabel: "अवलोकन", icon: LayoutDashboard },
    { id: "opportunities", label: "Opportunities", hindiLabel: "अवसर", icon: Compass, badge: "2" },
    { id: "partnerships", label: "My Partnerships", hindiLabel: "मेरी साझेदारियां", icon: Handshake, badge: "1" },
    { id: "funding", label: "Funding", hindiLabel: "वित्तपोषण", icon: Landmark },
    { id: "mentorship", label: "Mentorship", hindiLabel: "मार्गदर्शन", icon: GraduationCap },
    { id: "prototype-support", label: "Prototype Support", hindiLabel: "प्रोटोटाइप सहायता", icon: Sparkles },
    { id: "pilot-support", label: "Pilot Support", hindiLabel: "पायलट सहायता", icon: ShieldCheck },
    { id: "notifications", label: "Notifications", hindiLabel: "सूचनाएं", icon: Bell, badge: "1" },
  ],
  ADMIN: [
    { id: "overview", label: "Overview", hindiLabel: "अवलोकन", icon: LayoutDashboard },
    { id: "users", label: "Users", hindiLabel: "उपयोगकर्ता", icon: Users, badge: "5" },
    { id: "departments", label: "Departments", hindiLabel: "विभाग", icon: Building2 },
    { id: "universities", label: "Universities", hindiLabel: "विश्वविद्यालय", icon: GraduationCap },
    { id: "industries", label: "Industries", hindiLabel: "उद्योग", icon: Briefcase },
    { id: "ai-config", label: "AI Configuration", hindiLabel: "एआई विन्यास", icon: Cpu },
    { id: "knowledge-base", label: "Knowledge Base", hindiLabel: "ज्ञान कोष", icon: Database },
    { id: "system-audit", label: "System Audit", hindiLabel: "सिस्टम ऑडिट", icon: History },
  ],
  government: [
    { id: "overview", label: "Overview", hindiLabel: "अवलोकन", icon: LayoutDashboard },
  ],
  industry_csr: [
    { id: "overview", label: "Overview", hindiLabel: "अवलोकन", icon: LayoutDashboard },
  ],
  department_officer: [
    { id: "overview", label: "Overview", hindiLabel: "अवलोकन", icon: LayoutDashboard },
  ],
  admin: [
    { id: "overview", label: "Overview", hindiLabel: "अवलोकन", icon: LayoutDashboard },
  ],
  university: [
    { id: "overview", label: "Overview", hindiLabel: "अवलोकन", icon: LayoutDashboard },
  ],
};

const ROLE_TITLES: Partial<
  Record<Exclude<UserRole, "citizen" | "assisted_operator">, { en: string; hi: string }>
> = {
  DEPARTMENT_OFFICER: { en: "Department Officer", hi: "विभागीय अधिकारी" },
  INNOVATION_CELL: { en: "Innovation Cell", hi: "नवाचार प्रकोष्ठ" },
  UNIVERSITY: { en: "University Partner", hi: "विश्वविद्यालय भागीदार" },
  INDUSTRY: { en: "Industry & CSR Partner", hi: "उद्योग व सीएसआर भागीदार" },
  ADMIN: { en: "System Administrator", hi: "प्रणाली प्रशासक" },
  // Legacy keys
  reviewer: { en: "Reviewer Workspace", hi: "समीक्षक कार्यक्षेत्र" },
  department_officer: { en: "Department Officer", hi: "विभागीय अधिकारी" },
  government: { en: "Department Validation", hi: "विभागीय सत्यापन" },
  university: { en: "University Partner", hi: "विश्वविद्यालय भागीदार" },
  industry_csr: { en: "Industry & CSR Partner", hi: "उद्योग व सीएसआर भागीदार" },
  admin: { en: "System Administrator", hi: "प्रणाली प्रशासक" },
};

export interface RoleSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  activeItemId?: string;
  onSelectItem?: (itemId: string) => void;
  className?: string;
}

export function RoleSidebar({
  isOpen,
  onClose,
  currentRole,
  activeItemId,
  onSelectItem,
  className = "",
}: RoleSidebarProps) {
  const { language } = useLanguage();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Citizen and assisted operator do not have role sidebars (public pages)
  if (currentRole === "citizen" || currentRole === "assisted_operator") {
    return null;
  }

  const roleKey = currentRole as Exclude<UserRole, "citizen" | "assisted_operator">;
  const navItems = ROLE_NAV_CONFIGS[roleKey] || [];
  const roleTitle = ROLE_TITLES[roleKey] || { en: currentRole, hi: "" };
  const roleTitleText = language === "hi" && roleTitle.hi ? roleTitle.hi : roleTitle.en;

  const isValidActive = Boolean(activeItemId && navItems.some((item) => item.id === activeItemId));
  const currentActive = isValidActive
    ? (activeItemId as string)
    : navItems.length > 0
    ? navItems[0].id
    : "";

  return (
    <>
      {/* Floating Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Floating Role Sidebar Panel */}
      <aside
        aria-label={`${roleTitleText} navigation`}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 bg-white border-r border-[#E2E5EA] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
        } ${className}`}
      >
        {/* Sidebar Header: JharSetu Logo + Role Info + Close Button */}
        <div className="flex flex-col border-b border-[#E2E5EA] bg-[#F7F8FA]/60">
          <div className="flex h-16 items-center justify-between px-4">
            <Logo variant="full" size="sm" />
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#6B7280] hover:text-[#111827] hover:bg-[#E2E5EA]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F62B4]"
              aria-label="Close navigation sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-4 pb-2.5 pt-0">
            <div className="flex items-center gap-1.5 text-xs text-[#0F62B4] font-semibold">
              <span className="uppercase tracking-wider text-[10px] text-[#6B7280]">
                {language === "hi" ? "भूमिका:" : "Role:"}
              </span>
              <span className="font-bold truncate">{roleTitleText}</span>
            </div>
          </div>
        </div>

        {/* Navigation Item List: Fixed master screen tree per role */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
          <div className="px-3 pb-2 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
            {language === "hi" ? "कार्यक्षेत्र दृश्य" : "Workspace Views"} ({navItems.length})
          </div>

          {navItems.map((item) => {
            const isActive = currentActive === item.id;
            const Icon = item.icon;
            const itemLabel = language === "hi" && item.hindiLabel ? item.hindiLabel : item.label;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectItem?.(item.id);
                }}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all text-left ${
                  isActive
                    ? "bg-[#0F62B4]/10 text-[#0F62B4] font-bold border-l-4 border-l-[#0F62B4] shadow-xs"
                    : "text-[#111827] font-medium hover:bg-[#F7F8FA] hover:text-[#0F62B4] border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? "text-[#0F62B4]" : "text-[#6B7280] group-hover:text-[#0F62B4]"
                    }`}
                  />
                  <span className="truncate">{itemLabel}</span>
                </div>

                {item.badge && (
                  <span
                    className={`shrink-0 ml-2 px-1.5 py-0.5 text-[10px] rounded-full font-bold leading-none ${
                      isActive
                        ? "bg-[#0F62B4] text-white"
                        : "bg-[#E2E5EA] text-[#111827]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Informational metadata */}
        <div className="p-4 border-t border-[#E2E5EA] bg-[#F7F8FA]/50 text-[11px] text-[#6B7280]">
          <div className="flex items-center justify-between">
            <span>SIH 26043 Architecture</span>
            <span className="font-mono text-[10px] text-[#0F62B4]">v2.1</span>
          </div>
          <p className="mt-1 text-[10px] text-[#6B7280]">
            {language === "hi" ? "मानव-नियंत्रित नागरिक निर्णय प्रणाली" : "Human-governed civic decision system"}
          </p>
        </div>
      </aside>
    </>
  );
}

export default RoleSidebar;
