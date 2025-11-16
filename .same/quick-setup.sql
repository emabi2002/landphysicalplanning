-- ============================================
-- PHYSICAL PLANNING SYSTEM - QUICK SETUP
-- For Shared Authentication (admin@lands.gov.pg)
-- ============================================

-- STEP 1: Add admin user profile (automatic method)
-- This will find the existing auth user and create the profile
INSERT INTO public.users (id, email, full_name, role, department, status)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'System Administrator'),
  'admin',
  'Physical Planning Division',
  'active'
FROM auth.users
WHERE email = 'admin@lands.gov.pg'
ON CONFLICT (id) DO UPDATE
SET
  role = 'admin',
  department = 'Physical Planning Division',
  status = 'active';

-- STEP 2: Add sample zoning districts (optional)
INSERT INTO public.zoning_districts (name, code, description, color) VALUES
('Residential Zone 1', 'R1', 'Low density residential', '#10b981'),
('Commercial Zone', 'C1', 'Commercial business district', '#3b82f6'),
('Industrial Zone', 'I1', 'Light industrial', '#f59e0b'),
('Mixed Use Zone', 'MU1', 'Mixed residential and commercial', '#8b5cf6')
ON CONFLICT (code) DO NOTHING;

-- STEP 3: Add sample land parcels (optional)
INSERT INTO public.land_parcels (parcel_number, address, area_sqm, zoning_district_id, owner_name, status)
SELECT
  'P-2024-001',
  '123 Main Street, Port Moresby',
  500.00,
  id,
  'John Doe',
  'registered'
FROM public.zoning_districts WHERE code = 'R1'
ON CONFLICT (parcel_number) DO NOTHING;

INSERT INTO public.land_parcels (parcel_number, address, area_sqm, zoning_district_id, owner_name, status)
SELECT
  'P-2024-002',
  '456 Commerce Ave, Port Moresby',
  1200.00,
  id,
  'ABC Corporation',
  'registered'
FROM public.zoning_districts WHERE code = 'C1'
ON CONFLICT (parcel_number) DO NOTHING;

-- STEP 4: Add sample application (optional)
INSERT INTO public.development_applications (
  application_number,
  applicant_name,
  applicant_email,
  applicant_phone,
  application_type,
  project_title,
  project_description,
  proposed_use,
  estimated_cost,
  status,
  priority
) VALUES (
  'APP-2024-001',
  'Jane Smith',
  'jane@example.com',
  '+675 123 4567',
  'building_permit',
  'Two Story Residential Building',
  'Construction of a modern 2-story residential building with 4 bedrooms',
  'Residential',
  250000.00,
  'submitted',
  'normal'
)
ON CONFLICT (application_number) DO NOTHING;

-- STEP 5: Verify setup
SELECT
  'User Profile' as type,
  email,
  full_name,
  role,
  department,
  status
FROM public.users
WHERE email = 'admin@lands.gov.pg';

-- Check counts
SELECT
  'Statistics' as type,
  (SELECT COUNT(*) FROM public.zoning_districts) as zoning_districts,
  (SELECT COUNT(*) FROM public.land_parcels) as land_parcels,
  (SELECT COUNT(*) FROM public.development_applications) as applications;

-- ============================================
-- TEMPLATE: Add additional users
-- ============================================
-- Uncomment and modify to add more users:
/*
INSERT INTO public.users (id, email, full_name, role, department, status)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'User Name'),
  'planner',  -- Options: admin, planner, officer, viewer
  'Physical Planning Division',
  'active'
FROM auth.users
WHERE email = 'user@lands.gov.pg'  -- Change email here
ON CONFLICT (id) DO UPDATE
SET
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  status = EXCLUDED.status;
*/
