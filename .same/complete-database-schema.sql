-- ============================================
-- COMPLETE SYSTEM DATABASE SCHEMA
-- All modules fully functional
-- ============================================

-- ============================================
-- 1. SITE INSPECTIONS MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_inspections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inspection_number TEXT UNIQUE NOT NULL,

  -- Related Records
  application_id UUID REFERENCES public.development_applications(id),
  parcel_id UUID REFERENCES public.land_parcels(id),
  request_id UUID REFERENCES public.legal_planning_requests(id),

  -- Inspection Details
  inspection_type TEXT CHECK (inspection_type IN (
    'pre_application',
    'initial_site_visit',
    'construction_progress',
    'final_inspection',
    'compliance_check',
    'violation_investigation',
    'boundary_verification',
    'occupancy_inspection'
  )),

  purpose TEXT NOT NULL,
  findings TEXT,
  recommendations TEXT,

  -- Scheduling
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,

  -- Assignment
  inspector_id UUID REFERENCES public.users(id),
  assigned_by UUID REFERENCES public.users(id),

  -- Status
  status TEXT DEFAULT 'scheduled' CHECK (status IN (
    'scheduled',
    'in_progress',
    'completed',
    'cancelled',
    'rescheduled'
  )),

  -- Results
  compliance_status TEXT CHECK (compliance_status IN (
    'compliant',
    'non_compliant',
    'partial_compliance',
    'pending'
  )),

  -- Location
  site_address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Notes
  notes TEXT,
  weather_conditions TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inspections_scheduled ON public.site_inspections(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON public.site_inspections(status);
CREATE INDEX IF NOT EXISTS idx_inspections_inspector ON public.site_inspections(inspector_id);

-- ============================================
-- 2. COMPLIANCE RECORDS MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS public.compliance_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_number TEXT UNIQUE NOT NULL,

  -- Related Records
  parcel_id UUID REFERENCES public.land_parcels(id),
  application_id UUID REFERENCES public.development_applications(id),
  inspection_id UUID REFERENCES public.site_inspections(id),

  -- Violation Details
  violation_type TEXT CHECK (violation_type IN (
    'unauthorized_development',
    'zoning_violation',
    'building_code_violation',
    'environmental_violation',
    'permit_violation',
    'land_use_violation',
    'setback_violation',
    'height_violation',
    'other'
  )),

  violation_description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('minor', 'moderate', 'major', 'critical')),

  -- Reported By
  reported_by TEXT,
  reporter_contact TEXT,
  reported_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Investigation
  investigated_by UUID REFERENCES public.users(id),
  investigation_date TIMESTAMP WITH TIME ZONE,
  investigation_findings TEXT,

  -- Status
  status TEXT DEFAULT 'reported' CHECK (status IN (
    'reported',
    'under_investigation',
    'confirmed',
    'enforcement_action',
    'corrective_action_required',
    'resolved',
    'closed',
    'dismissed'
  )),

  -- Enforcement
  enforcement_action TEXT,
  enforcement_deadline TIMESTAMP WITH TIME ZONE,
  penalty_amount DECIMAL(12, 2),

  -- Resolution
  resolution_date TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compliance_status ON public.compliance_records(status);
CREATE INDEX IF NOT EXISTS idx_compliance_severity ON public.compliance_records(severity);
CREATE INDEX IF NOT EXISTS idx_compliance_parcel ON public.compliance_records(parcel_id);

-- ============================================
-- 3. DEVELOPMENT PLANS MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS public.development_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_number TEXT UNIQUE NOT NULL,

  -- Plan Details
  plan_name TEXT NOT NULL,
  plan_type TEXT CHECK (plan_type IN (
    'subdivision_plan',
    'site_development_plan',
    'master_plan',
    'urban_design_plan',
    'infrastructure_plan',
    'landscape_plan',
    'phasing_plan'
  )),

  description TEXT,

  -- Location
  location TEXT,
  parcel_ids UUID[], -- Array of related parcel IDs
  total_area_sqm DECIMAL(15, 2),

  -- Applicant
  applicant_name TEXT,
  applicant_contact TEXT,
  applicant_email TEXT,

  -- Planning Details
  proposed_lots INTEGER,
  proposed_units INTEGER,
  proposed_density DECIMAL(10, 2),

  -- Review
  submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES public.users(id),
  review_date TIMESTAMP WITH TIME ZONE,
  review_comments TEXT,

  -- Approval
  approved_by UUID REFERENCES public.users(id),
  approval_date TIMESTAMP WITH TIME ZONE,
  approval_conditions TEXT,

  -- Status
  status TEXT DEFAULT 'submitted' CHECK (status IN (
    'submitted',
    'under_review',
    'revision_required',
    'approved',
    'conditionally_approved',
    'rejected',
    'withdrawn',
    'expired'
  )),

  -- Validity
  valid_from DATE,
  valid_until DATE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plans_status ON public.development_plans(status);
CREATE INDEX IF NOT EXISTS idx_plans_submitted ON public.development_plans(submitted_date);

-- ============================================
-- 4. PLAN DOCUMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS public.plan_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_id UUID REFERENCES public.development_plans(id) ON DELETE CASCADE,

  document_type TEXT CHECK (document_type IN (
    'site_plan',
    'subdivision_plan',
    'engineering_drawings',
    'landscape_plan',
    'architectural_drawings',
    'survey_plan',
    'supporting_document'
  )),

  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  version INTEGER DEFAULT 1,

  uploaded_by UUID REFERENCES public.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. INSPECTION PHOTOS
-- ============================================

CREATE TABLE IF NOT EXISTS public.inspection_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inspection_id UUID REFERENCES public.site_inspections(id) ON DELETE CASCADE,

  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES public.users(id)
);

-- ============================================
-- 6. COMPLIANCE ACTIONS LOG
-- ============================================

CREATE TABLE IF NOT EXISTS public.compliance_actions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  compliance_id UUID REFERENCES public.compliance_records(id) ON DELETE CASCADE,

  action_type TEXT CHECK (action_type IN (
    'notice_issued',
    'warning_letter',
    'stop_work_order',
    'demolition_order',
    'fine_imposed',
    'court_referral',
    'corrective_action_completed',
    'follow_up_inspection',
    'case_closed'
  )),

  action_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action_by UUID REFERENCES public.users(id),
  action_details TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (Development Mode: Disabled)
-- ============================================

ALTER TABLE public.site_inspections DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_actions DISABLE ROW LEVEL SECURITY;

-- Verification
SELECT 'All Database Tables Created Successfully!' AS status;
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'site_inspections',
    'compliance_records',
    'development_plans',
    'plan_documents',
    'inspection_photos',
    'compliance_actions'
  )
ORDER BY table_name;
