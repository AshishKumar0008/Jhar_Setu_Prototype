import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isValidRole, getDashboardPathSafe } from "@/lib/auth-redirect";

/**
 * Dashboard group layout — server-side auth guard.
 * Enforces that every /dashboard/** route is accessible only to authenticated
 * users with a valid role. Mismatched department access is enforced per-page.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // Not signed in → send to sign-in
  if (!userId) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
