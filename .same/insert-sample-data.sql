-- ============================================
-- INSERT SAMPLE LEGAL REQUESTS DATA
-- ============================================
-- Copy and paste this into Supabase SQL Editor and click RUN

INSERT INTO public.legal_planning_requests (
  request_number,
  legal_case_number,
  legal_officer_name,
  legal_officer_email,
  request_type,
  subject,
  description,
  urgency,
  status,
  submitted_date,
  due_date,
  sla_days
) VALUES
  (
    'LR-2025-001',
    'LC-2025-048',
    'Sarah Johnson',
    'sarah.johnson@legal.gov.pg',
    'zoning_confirmation',
    'Zoning Confirmation for Parcel 123/456/789',
    'Legal Division requires confirmation of current zoning classification for land parcel 123/456/789 in relation to pending court case LC-2025-048.',
    'high',
    'submitted',
    NOW() - INTERVAL '2 days',
    NOW() + INTERVAL '8 days',
    10
  ),
  (
    'LR-2025-002',
    'LC-2025-051',
    'Michael Chen',
    'michael.chen@legal.gov.pg',
    'compliance_investigation_request',
    'Unauthorized Development Investigation - Waigani',
    'Request for compliance investigation regarding alleged unauthorized commercial development in residential zone.',
    'urgent',
    'received',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '5 days',
    7
  ),
  (
    'LR-2025-003',
    'LC-2024-892',
    'Patricia Kila',
    'patricia.kila@legal.gov.pg',
    'boundary_dispute_assessment',
    'Boundary Dispute Assessment - Hohola',
    'Assessment required for ongoing boundary dispute between adjacent property owners.',
    'normal',
    'assigned',
    NOW() - INTERVAL '5 days',
    NOW() + INTERVAL '5 days',
    10
  ),
  (
    'LR-2025-004',
    NULL,
    'David Wong',
    'david.wong@legal.gov.pg',
    'development_approval_verification',
    'Development Approval Verification',
    'Verify if development approval was granted for property development in 2022.',
    'low',
    'in_progress',
    NOW() - INTERVAL '10 days',
    NOW() + INTERVAL '2 days',
    12
  ),
  (
    'LR-2024-156',
    'LC-2024-701',
    'Grace Momo',
    'grace.momo@legal.gov.pg',
    'spatial_evidence_request',
    'Spatial Evidence - Encroachment Case',
    'Spatial evidence required for encroachment case involving commercial property.',
    'high',
    'completed',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '15 days',
    15
  ),
  (
    'LR-2024-189',
    NULL,
    'John Kaupa',
    'john.kaupa@legal.gov.pg',
    'zoning_change_verification',
    'Zoning Change History Verification',
    'Verify history of zoning changes for parcel over last 10 years.',
    'normal',
    'submitted',
    NOW() - INTERVAL '6 days',
    NOW() - INTERVAL '1 day',
    5
  );

-- Verify the insertion
SELECT 'Sample data inserted successfully!' AS message;
SELECT COUNT(*) AS total_records FROM public.legal_planning_requests;
SELECT request_number, subject, status, urgency FROM public.legal_planning_requests ORDER BY created_at DESC;
