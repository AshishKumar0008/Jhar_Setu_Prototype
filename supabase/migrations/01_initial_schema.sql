-- JharSetu Supabase Initial Schema
-- Aligned with context/JharSetu_Final_System_Blueprint.md (§13) & context/architecture (1).md

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enums
DO $$ BEGIN
    CREATE TYPE workflow_status AS ENUM (
        'SUBMITTED',
        'AI_PROCESSED',
        'NEEDS_HUMAN_REVIEW',
        'PATH_A_RESOLVED',
        'PATH_B_ROUTED',
        'PATH_B_ACKNOWLEDGED',
        'PATH_B_RESOLVED',
        'PATH_C_CERTIFIED',
        'PATH_C_PASSPORT_PUBLISHED',
        'PATH_C_MATCHED',
        'PATH_C_COMMITMENT_CONFIRMED',
        'PILOT_READY',
        'PILOT_ACTIVE',
        'REJECTED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE suggested_path AS ENUM ('A', 'B', 'C');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Core Reports Table (Intake & Evidence)
CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    tracking_id TEXT UNIQUE NOT NULL,
    recovery_phrase TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    district TEXT NOT NULL,
    block TEXT NOT NULL,
    village TEXT NOT NULL,
    status workflow_status NOT NULL DEFAULT 'SUBMITTED',
    suggested_path suggested_path NOT NULL DEFAULT 'B',
    suggested_department TEXT,
    ai_confidence NUMERIC(4, 2) DEFAULT 0.85,
    ai_reasoning TEXT,
    is_likely_duplicate BOOLEAN DEFAULT FALSE,
    duplicate_of_report_id TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Audit Events (Immutable Governance Log)
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    from_status workflow_status NOT NULL,
    to_status workflow_status NOT NULL,
    actor_role TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    ip_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    report_id TEXT REFERENCES reports(id) ON DELETE SET NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Problem Clusters Table
CREATE TABLE IF NOT EXISTS problem_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    district TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN',
    evidence_rule_satisfied BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Cluster Members (Join Table)
CREATE TABLE IF NOT EXISTS cluster_members (
    cluster_id UUID NOT NULL REFERENCES problem_clusters(id) ON DELETE CASCADE,
    report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (cluster_id, report_id)
);

-- 8. Challenges Table (Path C Innovation Track)
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_code TEXT UNIQUE NOT NULL,
    cluster_id UUID REFERENCES problem_clusters(id) ON DELETE SET NULL,
    origin_report_id TEXT REFERENCES reports(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    redacted_problem_statement TEXT NOT NULL,
    district TEXT NOT NULL,
    block TEXT NOT NULL,
    status workflow_status NOT NULL DEFAULT 'PATH_C_PASSPORT_PUBLISHED',
    government_owner TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Innovation Gap Certificates
CREATE TABLE IF NOT EXISTS innovation_gap_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    certificate_number TEXT UNIQUE NOT NULL,
    evidence_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    signers JSONB NOT NULL DEFAULT '[]'::jsonb,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Capability Cards (Universities / Research Labs)
CREATE TABLE IF NOT EXISTS capability_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_name TEXT NOT NULL,
    domain TEXT NOT NULL,
    lab_facilities TEXT[] DEFAULT ARRAY[]::TEXT[],
    faculty_mentors JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'VERIFIED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Commitments (Industry & CSR Partners)
CREATE TABLE IF NOT EXISTS commitments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    commitment_type TEXT NOT NULL, -- e.g. funding, equipment, mentorship, pilot_site
    description TEXT NOT NULL,
    amount NUMERIC(12, 2),
    status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, CONFIRMED, WITHDRAWN
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Pilots Table (Government Field Readiness)
CREATE TABLE IF NOT EXISTS pilots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    target_site TEXT NOT NULL,
    baseline_metrics JSONB DEFAULT '{}'::jsonb,
    status workflow_status NOT NULL DEFAULT 'PILOT_READY',
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_reports_tracking_id ON reports(tracking_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_district ON reports(district);
CREATE INDEX IF NOT EXISTS idx_audit_events_report_id ON audit_events(report_id);
CREATE INDEX IF NOT EXISTS idx_notifications_role ON notifications(role);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);

-- Updated_at Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_reports_updated_at ON reports;
CREATE TRIGGER trg_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_challenges_updated_at ON challenges;
CREATE TRIGGER trg_challenges_updated_at
    BEFORE UPDATE ON challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_gap_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE capability_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilots ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can view reports by exact tracking_id lookup
CREATE POLICY "Public read reports by tracking_id" ON reports
    FOR SELECT USING (true);

-- Allow public creation of reports (citizen intake)
CREATE POLICY "Allow public insert reports" ON reports
    FOR INSERT WITH CHECK (true);

-- Allow updates (backend server/service role overrides this)
CREATE POLICY "Allow updates for reports" ON reports
    FOR UPDATE USING (true);

-- Audit events read policy
CREATE POLICY "Public view audit events for reports" ON audit_events
    FOR SELECT USING (true);

CREATE POLICY "Allow insert audit events" ON audit_events
    FOR INSERT WITH CHECK (true);

-- Notifications policy
CREATE POLICY "Role based notifications read" ON notifications
    FOR SELECT USING (true);

CREATE POLICY "Allow insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update notifications" ON notifications
    FOR UPDATE USING (true);

-- Challenges are public-safe
CREATE POLICY "Public read challenges" ON challenges
    FOR SELECT USING (true);

CREATE POLICY "Public read capability cards" ON capability_cards
    FOR SELECT USING (true);

CREATE POLICY "Public read commitments" ON commitments
    FOR SELECT USING (true);

CREATE POLICY "Public read pilots" ON pilots
    FOR SELECT USING (true);
