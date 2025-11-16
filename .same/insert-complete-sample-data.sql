-- ============================================
-- COMPLETE SAMPLE DATA
-- For all modules
-- ============================================

-- ============================================
-- 1. SITE INSPECTIONS SAMPLE DATA
-- ============================================

INSERT INTO public.site_inspections (
  inspection_number,
  inspection_type,
  purpose,
  findings,
  recommendations,
  scheduled_date,
  status,
  compliance_status,
  site_address
) VALUES
  (
    'INSP-2025-001',
    'pre_application',
    'Pre-application site assessment for proposed commercial development',
    'Site is relatively flat with good access. Existing vegetation minimal. Drainage appears adequate.',
    'Recommend soil testing before final approval. Consider traffic impact study.',
    NOW() + INTERVAL '3 days',
    'scheduled',
    'pending',
    'Section 45, Waigani, Port Moresby'
  ),
  (
    'INSP-2025-002',
    'construction_progress',
    'Midpoint construction inspection for residential subdivision',
    'Construction proceeding according to approved plans. Foundation work completed satisfactorily.',
    'Ensure drainage systems are installed before proceeding to next phase.',
    NOW() - INTERVAL '2 days',
    'completed',
    'compliant',
    'Hohola Residential Subdivision, Port Moresby'
  ),
  (
    'INSP-2025-003',
    'violation_investigation',
    'Investigation of reported unauthorized construction',
    'Confirmed unauthorized extension to commercial building. No permits obtained.',
    'Issue stop-work order. Require retroactive permit application or demolition.',
    NOW() - INTERVAL '5 days',
    'completed',
    'non_compliant',
    '127 Wards Road, Port Moresby'
  ),
  (
    'INSP-2025-004',
    'final_inspection',
    'Final occupancy inspection for new office building',
    'All construction completed per approved plans. Safety systems operational.',
    'Approved for occupancy certificate issuance.',
    NOW() + INTERVAL '1 day',
    'scheduled',
    'pending',
    'Downtown Port Moresby Office Complex'
  ),
  (
    'INSP-2025-005',
    'boundary_verification',
    'Boundary verification for disputed property',
    'Survey markers located and verified. Discrepancy of 2.3m identified on eastern boundary.',
    'Recommend resurvey by licensed surveyor. Legal consultation advised.',
    NOW() - INTERVAL '10 days',
    'completed',
    'partial_compliance',
    'Boroko, Section 12, Lot 456'
  );

-- ============================================
-- 2. COMPLIANCE RECORDS SAMPLE DATA
-- ============================================

INSERT INTO public.compliance_records (
  case_number,
  violation_type,
  violation_description,
  severity,
  reported_by,
  reporter_contact,
  reported_date,
  investigation_findings,
  status,
  enforcement_action
) VALUES
  (
    'COMP-2025-001',
    'unauthorized_development',
    'Unauthorized commercial extension to residential property without permits',
    'major',
    'Neighbor Complaint',
    '7234-5678',
    NOW() - INTERVAL '7 days',
    'Site inspection confirmed 50sqm unauthorized extension used for commercial purposes.',
    'enforcement_action',
    'Stop-work order issued. Retroactive permit required or demolition within 30 days.'
  ),
  (
    'COMP-2025-002',
    'zoning_violation',
    'Operating commercial business in residential zone',
    'moderate',
    'Planning Officer',
    'officer@planning.gov.pg',
    NOW() - INTERVAL '15 days',
    'Confirmed retail shop operating in R1 residential zone without special permit.',
    'corrective_action_required',
    'Cease commercial operations within 14 days or apply for rezoning/special permit.'
  ),
  (
    'COMP-2025-003',
    'building_code_violation',
    'Construction not meeting minimum setback requirements',
    'minor',
    'Building Inspector',
    '7345-6789',
    NOW() - INTERVAL '20 days',
    'Structure built 1.5m from boundary instead of required 3m setback.',
    'resolved',
    'Owner submitted variance application. Approved with conditions.'
  ),
  (
    'COMP-2025-004',
    'environmental_violation',
    'Unauthorized clearing of protected vegetation',
    'critical',
    'Environment Department',
    'environment@dec.gov.pg',
    NOW() - INTERVAL '3 days',
    'Investigation pending. Site visit scheduled.',
    'under_investigation',
    NULL
  ),
  (
    'COMP-2025-005',
    'height_violation',
    'Building exceeds maximum height restriction',
    'major',
    'Anonymous',
    NULL,
    NOW() - INTERVAL '5 days',
    'Building measures 18m height in 15m height restriction zone.',
    'enforcement_action',
    'Building permit suspended. Options: reduce height or apply for height variance.'
  );

-- ============================================
-- 3. DEVELOPMENT PLANS SAMPLE DATA
-- ============================================

INSERT INTO public.development_plans (
  plan_number,
  plan_name,
  plan_type,
  description,
  location,
  total_area_sqm,
  applicant_name,
  applicant_contact,
  applicant_email,
  proposed_lots,
  proposed_units,
  submitted_date,
  status,
  review_comments
) VALUES
  (
    'PLAN-2025-001',
    'Waigani Gardens Residential Subdivision',
    'subdivision_plan',
    '50-lot residential subdivision with infrastructure including roads, drainage, and utilities.',
    'Waigani, NCD',
    125000,
    'PNG Property Developers Ltd',
    '325-4567',
    'info@pngproperty.com.pg',
    50,
    50,
    NOW() - INTERVAL '14 days',
    'under_review',
    'Initial review completed. Awaiting drainage engineering report.'
  ),
  (
    'PLAN-2025-002',
    'Downtown Mixed-Use Development',
    'site_development_plan',
    'Mixed-use development with ground floor retail and 4 floors residential apartments.',
    'Port Moresby CBD',
    8500,
    'Urban Developments PNG',
    '325-9876',
    'contact@urbandev.pg',
    NULL,
    40,
    NOW() - INTERVAL '30 days',
    'approved',
    'Approved subject to traffic management plan and parking requirements.'
  ),
  (
    'PLAN-2025-003',
    'Gerehu Extension Master Plan',
    'master_plan',
    'Comprehensive master plan for 500-lot residential expansion including schools and parks.',
    'Gerehu, NCD',
    750000,
    'National Housing Corporation',
    '325-1234',
    'planning@nhc.gov.pg',
    500,
    500,
    NOW() - INTERVAL '45 days',
    'revision_required',
    'Requires revision to road network design and green space allocation.'
  ),
  (
    'PLAN-2025-004',
    'Industrial Park Infrastructure Plan',
    'infrastructure_plan',
    'Infrastructure layout for new industrial park including utilities and access roads.',
    'Nine Mile, NCD',
    250000,
    'PNG Industrial Estates',
    '325-5555',
    'info@pngindustrial.com',
    25,
    NULL,
    NOW() - INTERVAL '7 days',
    'submitted',
    NULL
  ),
  (
    'PLAN-2025-005',
    'Boroko Commercial Plaza',
    'site_development_plan',
    'Two-story commercial plaza with parking facilities.',
    'Boroko, NCD',
    12000,
    'Boroko Investments Ltd',
    '325-7890',
    'develop@boroko.pg',
    NULL,
    NULL,
    NOW() - INTERVAL '60 days',
    'conditionally_approved',
    'Approved with conditions: Must provide additional parking and loading zones.'
  );

-- ============================================
-- 4. COMPLIANCE ACTIONS SAMPLE DATA
-- ============================================

INSERT INTO public.compliance_actions (
  compliance_id,
  action_type,
  action_date,
  action_details
)
SELECT
  id,
  'notice_issued',
  created_at + INTERVAL '1 day',
  'Official notice of violation sent via registered mail.'
FROM public.compliance_records
WHERE case_number = 'COMP-2025-001'

UNION ALL

SELECT
  id,
  'stop_work_order',
  created_at + INTERVAL '3 days',
  'Stop-work order posted at site. Construction halted pending permit resolution.'
FROM public.compliance_records
WHERE case_number = 'COMP-2025-001'

UNION ALL

SELECT
  id,
  'warning_letter',
  created_at + INTERVAL '2 days',
  'Formal warning letter issued. 14-day deadline for corrective action.'
FROM public.compliance_records
WHERE case_number = 'COMP-2025-002'

UNION ALL

SELECT
  id,
  'corrective_action_completed',
  created_at + INTERVAL '18 days',
  'Variance application approved. Compliance achieved.'
FROM public.compliance_records
WHERE case_number = 'COMP-2025-003'

UNION ALL

SELECT
  id,
  'case_closed',
  created_at + INTERVAL '20 days',
  'Case closed following successful resolution.'
FROM public.compliance_records
WHERE case_number = 'COMP-2025-003';

-- Verification
SELECT '✅ Complete Sample Data Inserted!' AS status;

SELECT 'Inspections:' as module, COUNT(*) as records FROM public.site_inspections
UNION ALL
SELECT 'Compliance:', COUNT(*) FROM public.compliance_records
UNION ALL
SELECT 'Development Plans:', COUNT(*) FROM public.development_plans
UNION ALL
SELECT 'Compliance Actions:', COUNT(*) FROM public.compliance_actions;

-- Show summary
SELECT
  '📊 Summary by Module' as report,
  (SELECT COUNT(*) FROM site_inspections) as inspections,
  (SELECT COUNT(*) FROM compliance_records) as compliance_cases,
  (SELECT COUNT(*) FROM development_plans) as plans,
  (SELECT COUNT(*) FROM legal_planning_requests) as division_requests;
