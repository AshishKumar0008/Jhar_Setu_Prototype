"use client";

import React from "react";
import {
  DashboardShell,
  DashboardShellProps,
} from "@/components/dashboard/dashboard-shell";

export type AuthenticatedLayoutProps = DashboardShellProps;

/**
 * AuthenticatedLayout wraps internal dashboard experiences with:
 * - Sidebar top: [ JharSetu Logo ]
 * - Header: Department/Role info, notifications, Clerk profile
 * - Main content area
 */
export function AuthenticatedLayout(props: AuthenticatedLayoutProps) {
  return <DashboardShell {...props} />;
}

export default AuthenticatedLayout;
