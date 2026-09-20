import { createAdminClient } from "../admin";
import { WorkflowStatus } from "@/lib/store";

export interface ChallengePassportItem {
  id: string;
  challengeCode: string;
  title: string;
  redactedProblemStatement: string;
  district: string;
  block: string;
  status: WorkflowStatus;
  governmentOwner?: string;
  createdAt: string;
  updatedAt: string;
  certificate?: {
    certificateNumber: string;
    issuedAt: string;
    evidenceSnapshot: Record<string, any>;
  };
  commitments?: Array<{
    organizationName: string;
    commitmentType: string;
    description: string;
    amount?: number;
    status: string;
  }>;
}

export async function fetchPublicChallenges(filters?: {
  district?: string;
  category?: string;
}): Promise<ChallengePassportItem[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  let query = supabase
    .from("challenges")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.district && filters.district !== "all") {
    query = query.ilike("district", filters.district);
  }

  const { data: challenges, error } = await query;
  if (error || !challenges) {
    console.error("fetchPublicChallenges error:", error);
    return [];
  }

  const { data: certs } = await supabase.from("innovation_gap_certificates").select("*");
  const { data: commitments } = await supabase.from("commitments").select("*");

  return challenges.map((item) => {
    const cert = certs?.find((c) => c.challenge_id === item.id);
    const itemCommitments = commitments?.filter((c) => c.challenge_id === item.id);

    return {
      id: item.id,
      challengeCode: item.challenge_code,
      title: item.title,
      redactedProblemStatement: item.redacted_problem_statement,
      district: item.district,
      block: item.block,
      status: item.status as WorkflowStatus,
      governmentOwner: item.government_owner ?? undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      certificate: cert
        ? {
            certificateNumber: cert.certificate_number,
            issuedAt: cert.issued_at,
            evidenceSnapshot: (cert.evidence_snapshot as Record<string, any>) || {},
          }
        : undefined,
      commitments: itemCommitments?.map((c) => ({
        organizationName: c.organization_name,
        commitmentType: c.commitment_type,
        description: c.description,
        amount: c.amount ?? undefined,
        status: c.status,
      })),
    };
  });
}

export async function fetchChallengeById(
  id: string
): Promise<ChallengePassportItem | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("*")
    .or(`id.eq.${id},challenge_code.eq.${id}`)
    .maybeSingle();

  if (error || !challenge) {
    if (error) console.error("fetchChallengeById error:", error);
    return null;
  }

  const { data: certs } = await supabase
    .from("innovation_gap_certificates")
    .select("*")
    .eq("challenge_id", challenge.id);

  const { data: commitments } = await supabase
    .from("commitments")
    .select("*")
    .eq("challenge_id", challenge.id);

  const cert = certs?.[0];

  return {
    id: challenge.id,
    challengeCode: challenge.challenge_code,
    title: challenge.title,
    redactedProblemStatement: challenge.redacted_problem_statement,
    district: challenge.district,
    block: challenge.block,
    status: challenge.status as WorkflowStatus,
    governmentOwner: challenge.government_owner ?? undefined,
    createdAt: challenge.created_at,
    updatedAt: challenge.updated_at,
    certificate: cert
      ? {
          certificateNumber: cert.certificate_number,
          issuedAt: cert.issued_at,
          evidenceSnapshot: (cert.evidence_snapshot as Record<string, any>) || {},
        }
      : undefined,
    commitments: commitments?.map((c) => ({
      organizationName: c.organization_name,
      commitmentType: c.commitment_type,
      description: c.description,
      amount: c.amount ?? undefined,
      status: c.status,
    })),
  };
}
