/**
 * Role-to-dashboard path mapping.
 * Source of truth: context/feature-specs/06-auth-and-dashboards.md
 *
 * Role is stored in Clerk publicMetadata.role (set only via Clerk dashboard —
 * no frontend control may write or mutate this field).
 */

export type AuthRole =
  | "ADMIN"
  | "DEPARTMENT_OFFICER"
  | "INNOVATION_CELL"
  | "UNIVERSITY"
  | "INDUSTRY"
  | "INDUSTRY_CSR";

export function getDashboardPath(role: AuthRole, department?: string): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "INNOVATION_CELL":
      return "/dashboard/innovation";
    case "UNIVERSITY":
      return "/dashboard/university";
    case "INDUSTRY":
    case "INDUSTRY_CSR":
      return "/dashboard/industry";
    case "DEPARTMENT_OFFICER":
      if (department) {
        return `/dashboard/department/${department.toLowerCase()}`;
      }
      return "/dashboard/department";
  }
}

/**
 * Safe version — returns fallback or null on invalid state.
 */
export function getDashboardPathSafe(
  role: AuthRole,
  department?: string
): string | null {
  try {
    return getDashboardPath(role, department);
  } catch {
    return "/dashboard/department";
  }
}

export function isValidRole(role: unknown): role is AuthRole {
  return (
    typeof role === "string" &&
    [
      "ADMIN",
      "DEPARTMENT_OFFICER",
      "INNOVATION_CELL",
      "UNIVERSITY",
      "INDUSTRY",
      "INDUSTRY_CSR",
    ].includes(role)
  );
}
