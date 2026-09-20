-- JharSetu Seed Data Script
-- Seed data for SIH 26043 demo cases

-- 1. Insert Seed Reports
INSERT INTO reports (
    id,
    tracking_id,
    recovery_phrase,
    title,
    description,
    category,
    district,
    block,
    village,
    status,
    suggested_path,
    suggested_department,
    ai_confidence,
    ai_reasoning,
    is_likely_duplicate,
    created_at,
    updated_at
) VALUES
(
    'JH-2026-B101',
    'JH-2026-B101',
    'sal-forest-dam-bridge',
    'Severe road cratering and structural collapse on Ring Road Section 4',
    'Heavy monsoon rains caused a 3-meter deep crater near Tupudana intersection, blocking transport trucks and creating serious road accident risks.',
    'infrastructure',
    'Ranchi',
    'Namkum',
    'Tupudana',
    'PATH_B_ROUTED',
    'B',
    'Road Construction Department (RCD)',
    0.94,
    'Established maintenance responsibility under RCD state highway schedule; standard authority repair mandate without novelty.',
    false,
    '2026-09-14T09:30:00.000Z',
    '2026-09-14T09:05:41.332Z'
),
(
    'JH-2026-C201',
    'JH-2026-C201',
    'amber-granite-river-falcon',
    'High fluoride & heavy metal leachate across 14 borewells',
    'Groundwater tests across Simaria block show fluoride levels 4x permissible limits and unexplained arsenic spikes. 3 past filtration attempts failed due to rocky basalt clogging.',
    'water_sanitation',
    'Chatra',
    'Simaria',
    'Bagra',
    'NEEDS_HUMAN_REVIEW',
    'C',
    'Drinking Water and Sanitation Department (DWSD)',
    0.89,
    'Recurring technical failure with standard filtration units across clustered coordinates; qualifies as high-evidence candidate for Innovation Gap Certificate.',
    false,
    '2026-09-14T10:15:00.000Z',
    '2026-09-14T10:15:00.000Z'
),
(
    'JH-2026-4708',
    'JH-2026-4708',
    'river-river-amber-sal',
    'Broken transformer causing power surge in Ormanjhi',
    'Street line transformer blew out sparking sparks onto nearby thatched roofs. Power outage in 4 wards.',
    'electricity',
    'Ranchi',
    'Ormanjhi',
    'Chutupalu',
    'SUBMITTED',
    'B',
    NULL,
    0.85,
    'Awaiting automated triage pipeline.',
    false,
    '2026-09-14T09:07:04.407Z',
    '2026-09-14T09:07:04.407Z'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Audit Trail Entries
INSERT INTO audit_events (
    report_id,
    from_status,
    to_status,
    actor_role,
    actor_name,
    reason,
    created_at
) VALUES
(
    'JH-2026-B101',
    'SUBMITTED',
    'AI_PROCESSED',
    'system',
    'AI Pipeline (Gemini 2.0 Flash)',
    'Structured extraction and grievance classification completed.',
    '2026-09-14T09:30:05.000Z'
),
(
    'JH-2026-B101',
    'AI_PROCESSED',
    'NEEDS_HUMAN_REVIEW',
    'system',
    'Workflow Guard',
    'AI suggestion queued for human reviewer confirmation.',
    '2026-09-14T09:30:06.000Z'
),
(
    'JH-2026-B101',
    'NEEDS_HUMAN_REVIEW',
    'PATH_B_ROUTED',
    'reviewer',
    'Ananya Sharma (Review Officer)',
    'Confirmed jurisdiction under Road Construction Department schedule. Priority dispatch.',
    '2026-09-14T09:05:41.331Z'
),
(
    'JH-2026-C201',
    'SUBMITTED',
    'AI_PROCESSED',
    'system',
    'AI Pipeline (Gemini 2.0 Flash)',
    'Multimodal anomaly detection flagged recurring filtration breakdown.',
    '2026-09-14T10:15:04.000Z'
),
(
    'JH-2026-C201',
    'AI_PROCESSED',
    'NEEDS_HUMAN_REVIEW',
    'system',
    'Workflow Guard',
    'Proposed Path C Innovation Gap Certificate awaiting human sign-off.',
    '2026-09-14T10:15:05.000Z'
),
(
    'JH-2026-4708',
    'SUBMITTED',
    'SUBMITTED',
    'citizen',
    'Citizen Reporter',
    'Citizen intake submitted via PWA portal.',
    '2026-09-14T09:07:04.407Z'
);

-- 3. Insert Initial Notifications
INSERT INTO notifications (
    id,
    role,
    title,
    message,
    report_id,
    read,
    created_at
) VALUES
(
    'notif-1789376824411-kje8z',
    'reviewer',
    'New Citizen Report Submitted',
    'Report JH-2026-4708 filed in Ranchi (electricity). Queued for AI triage.',
    'JH-2026-4708',
    false,
    '2026-09-14T09:07:04.412Z'
),
(
    'notif-1789376741333-55i9e',
    'department_officer',
    'New Grievance Case Routed',
    'Report JH-2026-B101 (infrastructure) routed to Road Construction Department (RCD).',
    'JH-2026-B101',
    false,
    '2026-09-14T09:05:41.333Z'
),
(
    'notif-init-1',
    'reviewer',
    '2 Reports Awaiting Human Review',
    'New road damage (Path B candidate) and groundwater leachate (Path C candidate) require verification.',
    'JH-2026-B101',
    false,
    '2026-09-14T10:15:10.000Z'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Capability Cards (Universities)
INSERT INTO capability_cards (
    institution_name,
    domain,
    lab_facilities,
    faculty_mentors,
    status
) VALUES
(
    'Birla Institute of Technology (BIT), Mesra',
    'Water Resource Engineering & Advanced Membrane Filtration',
    ARRAY['Environmental Nanotechnology Lab', 'Water Chemical Analysis Facility', 'Hydrology Simulation Cluster'],
    '[{"name": "Dr. R. K. Soren", "department": "Civil & Environmental Engineering", "specialization": "Fluoride remediation in rocky basalt aquifers"}]'::jsonb,
    'VERIFIED'
),
(
    'National Institute of Technology (NIT), Jamshedpur',
    'Metallurgical & Material Characterization Lab',
    ARRAY['Spectroscopy Center', 'Geotechnical Testing Pit', 'Materials Synthesis Unit'],
    '[{"name": "Prof. S. Mukherjee", "department": "Materials Engineering", "specialization": "Low-cost porous ceramic filtration media"}]'::jsonb,
    'VERIFIED'
);

-- 5. Seed Challenge and Innovation Gap Certificate
DO $$
DECLARE
    v_challenge_id UUID;
BEGIN
    INSERT INTO challenges (
        challenge_code,
        origin_report_id,
        title,
        redacted_problem_statement,
        district,
        block,
        status,
        government_owner
    ) VALUES (
        'CH-2026-W01',
        'JH-2026-C201',
        'Low-Cost Continuous Water-Quality Monitoring and Basalt Aquifer Defluoridation',
        'Recurring fluoride leachate exceeding 4x permissible limits across 14 rural borewells. Prior mechanical filters clogged within 6 weeks due to high iron and rocky basalt sediments.',
        'Chatra',
        'Simaria',
        'PATH_C_PASSPORT_PUBLISHED',
        'Drinking Water and Sanitation Department (DWSD)'
    )
    RETURNING id INTO v_challenge_id;

    INSERT INTO innovation_gap_certificates (
        challenge_id,
        certificate_number,
        evidence_snapshot,
        signers
    ) VALUES (
        v_challenge_id,
        'IGC-2026-JH-0042',
        '{"district": "Chatra", "fluoride_ppm": 6.2, "affected_borewells": 14, "prior_failures": 3}'::jsonb,
        '[{"name": "Ananya Sharma", "role": "Lead Reviewer", "date": "2026-09-14"}, {"name": "Dr. P. K. Verma", "role": "State Nodal Technical Officer", "date": "2026-09-14"}]'::jsonb
    );

    INSERT INTO commitments (
        challenge_id,
        organization_name,
        commitment_type,
        description,
        amount,
        status
    ) VALUES (
        v_challenge_id,
        'Tata Steel Foundation CSR',
        'funding_and_field_support',
        'Pledge for pilot site hardware installation and 12-month community maintenance stipends.',
        750000.00,
        'CONFIRMED'
    );
END $$;
