-- ============================================
-- UPGRADE: Division Requests System
-- Transform legal_planning_requests into general division requests
-- ============================================

-- Step 1: Add new columns for division tracking
ALTER TABLE public.legal_planning_requests
ADD COLUMN IF NOT EXISTS requesting_division TEXT,
ADD COLUMN IF NOT EXISTS receiving_division TEXT,
ADD COLUMN IF NOT EXISTS direction TEXT CHECK (direction IN ('incoming', 'outgoing'));

-- Step 2: Update existing data (assume all current requests are FROM Legal TO Physical Planning)
UPDATE public.legal_planning_requests
SET
  requesting_division = 'Legal Division',
  receiving_division = 'Physical Planning Division',
  direction = 'incoming'
WHERE requesting_division IS NULL;

-- Step 3: Update request types to be more general
ALTER TABLE public.legal_planning_requests
DROP CONSTRAINT IF EXISTS legal_planning_requests_request_type_check;

ALTER TABLE public.legal_planning_requests
ADD CONSTRAINT legal_planning_requests_request_type_check
CHECK (request_type IN (
  'information_request',
  'document_request',
  'technical_opinion',
  'site_inspection_request',
  'approval_request',
  'verification_request',
  'zoning_confirmation',
  'zoning_change_verification',
  'development_approval_verification',
  'compliance_investigation_request',
  'unauthorized_development_report',
  'parcel_history_request',
  'inspection_findings_request',
  'spatial_evidence_request',
  'boundary_dispute_assessment',
  'planning_opinion',
  'financial_clearance',
  'budget_allocation',
  'procurement_request',
  'hr_request',
  'it_support_request',
  'other'
));

-- Step 4: Add contact person fields (more general than "legal officer")
ALTER TABLE public.legal_planning_requests
ADD COLUMN IF NOT EXISTS contact_person_name TEXT,
ADD COLUMN IF NOT EXISTS contact_person_email TEXT,
ADD COLUMN IF NOT EXISTS contact_person_phone TEXT,
ADD COLUMN IF NOT EXISTS division_reference TEXT;

-- Step 5: Copy data from legal_officer fields to contact_person fields
UPDATE public.legal_planning_requests
SET
  contact_person_name = COALESCE(legal_officer_name, contact_person_name),
  contact_person_email = COALESCE(legal_officer_email, contact_person_email),
  contact_person_phone = COALESCE(legal_officer_phone, contact_person_phone),
  division_reference = COALESCE(legal_division_ref, division_reference);

-- Step 6: Create view for better querying
CREATE OR REPLACE VIEW division_requests_view AS
SELECT
  id,
  request_number,
  requesting_division,
  receiving_division,
  direction,
  COALESCE(contact_person_name, legal_officer_name) as contact_name,
  COALESCE(contact_person_email, legal_officer_email) as contact_email,
  COALESCE(contact_person_phone, legal_officer_phone) as contact_phone,
  COALESCE(division_reference, legal_division_ref, legal_case_number) as reference_number,
  request_type,
  subject,
  description,
  urgency,
  status,
  submitted_date,
  due_date,
  sla_days,
  is_overdue,
  days_remaining,
  assigned_to,
  assigned_at,
  response_summary,
  findings,
  recommendations,
  created_at,
  updated_at
FROM public.legal_planning_requests;

-- Verification
SELECT 'Division Requests System Upgraded!' AS status;
SELECT
  requesting_division,
  receiving_division,
  direction,
  COUNT(*) as total_requests
FROM public.legal_planning_requests
GROUP BY requesting_division, receiving_division, direction;
