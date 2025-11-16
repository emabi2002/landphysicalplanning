-- ============================================
-- SAMPLE DATA: Division Requests
-- Showing requests FROM and TO various divisions
-- ============================================

-- First, run the upgrade script if you haven't already
-- Then insert these diverse division requests

INSERT INTO public.legal_planning_requests (
  request_number,
  requesting_division,
  receiving_division,
  direction,
  contact_person_name,
  contact_person_email,
  request_type,
  subject,
  description,
  urgency,
  status,
  submitted_date,
  due_date,
  sla_days
) VALUES
  -- INCOMING: From Legal Division
  (
    'REQ-2025-001',
    'Legal Division',
    'Physical Planning Division',
    'incoming',
    'Sarah Johnson',
    'sarah.johnson@legal.gov.pg',
    'zoning_confirmation',
    'Zoning Confirmation for Court Case LC-2025-048',
    'Legal Division requires urgent zoning confirmation for land parcel 123/456/789 related to pending court proceedings.',
    'high',
    'submitted',
    NOW() - INTERVAL '2 days',
    NOW() + INTERVAL '8 days',
    10
  ),

  -- INCOMING: From Finance Division
  (
    'REQ-2025-002',
    'Finance Division',
    'Physical Planning Division',
    'incoming',
    'Michael Chen',
    'michael.chen@finance.gov.pg',
    'financial_clearance',
    'Financial Clearance for Development Project',
    'Finance requires planning confirmation before releasing funds for Waigani commercial development project.',
    'normal',
    'received',
    NOW() - INTERVAL '3 days',
    NOW() + INTERVAL '7 days',
    10
  ),

  -- INCOMING: From HR Division
  (
    'REQ-2025-003',
    'Human Resources Division',
    'Physical Planning Division',
    'incoming',
    'Patricia Kila',
    'patricia.kila@hr.gov.pg',
    'document_request',
    'Employment Verification Documents',
    'HR requires planning officer employment verification documents for officer promotion review.',
    'low',
    'assigned',
    NOW() - INTERVAL '5 days',
    NOW() + INTERVAL '15 days',
    20
  ),

  -- OUTGOING: To Legal Division
  (
    'REQ-2025-004',
    'Physical Planning Division',
    'Legal Division',
    'outgoing',
    'James Poka',
    'james.poka@planning.gov.pg',
    'technical_opinion',
    'Legal Opinion on Zoning Amendment',
    'Physical Planning requests legal opinion on proposed zoning amendment for industrial expansion in Port Moresby.',
    'urgent',
    'in_progress',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '5 days',
    7
  ),

  -- OUTGOING: To Surveyor General
  (
    'REQ-2025-005',
    'Physical Planning Division',
    'Surveyor General Office',
    'outgoing',
    'David Wong',
    'david.wong@planning.gov.pg',
    'site_inspection_request',
    'Cadastral Survey Verification Request',
    'Requesting surveyor verification of boundary markers for disputed parcel in Hohola.',
    'high',
    'submitted',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '10 days',
    12
  ),

  -- INCOMING: From IT Division
  (
    'REQ-2025-006',
    'IT Division',
    'Physical Planning Division',
    'incoming',
    'Grace Momo',
    'grace.momo@it.gov.pg',
    'it_support_request',
    'GIS System Database Backup Requirements',
    'IT requires specifications for GIS database backup and disaster recovery planning.',
    'normal',
    'completed',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '5 days',
    15
  ),

  -- INCOMING: From Procurement
  (
    'REQ-2025-007',
    'Procurement Division',
    'Physical Planning Division',
    'incoming',
    'John Kaupa',
    'john.kaupa@procurement.gov.pg',
    'approval_request',
    'Equipment Procurement Approval',
    'Procurement requires technical approval for new surveying equipment purchase.',
    'normal',
    'submitted',
    NOW() - INTERVAL '4 days',
    NOW() + INTERVAL '6 days',
    10
  ),

  -- OUTGOING: To Finance
  (
    'REQ-2025-008',
    'Physical Planning Division',
    'Finance Division',
    'outgoing',
    'Mary Toka',
    'mary.toka@planning.gov.pg',
    'budget_allocation',
    'Budget Request for Field Equipment',
    'Requesting budget allocation for GPS units and field surveying equipment for 2025.',
    'high',
    'received',
    NOW() - INTERVAL '7 days',
    NOW() + INTERVAL '14 days',
    21
  );

-- Verification
SELECT 'Sample Division Requests Created!' AS message;
SELECT
  requesting_division,
  receiving_division,
  direction,
  COUNT(*) as count
FROM public.legal_planning_requests
GROUP BY requesting_division, receiving_division, direction
ORDER BY direction, requesting_division;
