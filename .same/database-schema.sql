-- Physical Planning Management System Database Schema
-- This schema should be executed in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'planner', 'officer', 'viewer')),
  department TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zoning Districts table
CREATE TABLE IF NOT EXISTS public.zoning_districts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT, -- For map visualization
  regulations JSONB, -- Store zoning regulations as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Land Parcels table
CREATE TABLE IF NOT EXISTS public.land_parcels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  parcel_number TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  area_sqm DECIMAL(15, 2),
  zoning_district_id UUID REFERENCES public.zoning_districts(id),
  owner_name TEXT,
  owner_contact TEXT,
  coordinates JSONB, -- Store GeoJSON or lat/lng
  land_use TEXT,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'disputed', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Applications table
CREATE TABLE IF NOT EXISTS public.development_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_number TEXT UNIQUE NOT NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT,
  applicant_phone TEXT,
  parcel_id UUID REFERENCES public.land_parcels(id),
  application_type TEXT NOT NULL CHECK (application_type IN (
    'building_permit',
    'subdivision',
    'change_of_use',
    'rezoning',
    'site_plan_approval',
    'variance',
    'special_permit'
  )),
  project_title TEXT NOT NULL,
  project_description TEXT,
  estimated_cost DECIMAL(15, 2),
  proposed_use TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN (
    'submitted',
    'under_review',
    'pending_info',
    'approved',
    'rejected',
    'withdrawn'
  )),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.users(id),
  submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  review_deadline TIMESTAMP WITH TIME ZONE,
  decision_date TIMESTAMP WITH TIME ZONE,
  decision_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application Documents table
CREATE TABLE IF NOT EXISTS public.application_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.development_applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'site_plan',
    'architectural_drawing',
    'survey_plan',
    'environmental_study',
    'traffic_study',
    'title_deed',
    'identity_document',
    'other'
  )),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES public.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application Reviews table (workflow tracking)
CREATE TABLE IF NOT EXISTS public.application_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.development_applications(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.users(id),
  review_stage TEXT NOT NULL CHECK (review_stage IN (
    'initial_screening',
    'technical_review',
    'site_inspection',
    'public_consultation',
    'final_decision'
  )),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'on_hold')),
  comments TEXT,
  recommendations TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Inspections table
CREATE TABLE IF NOT EXISTS public.site_inspections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.development_applications(id) ON DELETE CASCADE,
  inspector_id UUID REFERENCES public.users(id),
  inspection_date TIMESTAMP WITH TIME ZONE NOT NULL,
  inspection_type TEXT CHECK (inspection_type IN ('pre_approval', 'progress', 'final', 'compliance')),
  findings TEXT,
  compliance_status TEXT CHECK (compliance_status IN ('compliant', 'non_compliant', 'partial')),
  photos JSONB, -- Array of photo URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Plans table
CREATE TABLE IF NOT EXISTS public.development_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN (
    'master_plan',
    'local_area_plan',
    'sector_plan',
    'strategic_plan'
  )),
  description TEXT,
  coverage_area TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'consultation', 'approved', 'active', 'archived')),
  document_url TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance Monitoring table
CREATE TABLE IF NOT EXISTS public.compliance_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.development_applications(id),
  parcel_id UUID REFERENCES public.land_parcels(id),
  violation_type TEXT,
  violation_description TEXT,
  severity TEXT CHECK (severity IN ('minor', 'moderate', 'severe', 'critical')),
  reported_by UUID REFERENCES public.users(id),
  reported_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  resolution_notes TEXT,
  resolved_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Log table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.development_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_assigned ON public.development_applications(assigned_to);
CREATE INDEX IF NOT EXISTS idx_applications_submitted ON public.development_applications(submitted_date);
CREATE INDEX IF NOT EXISTS idx_parcels_zoning ON public.land_parcels(zoning_district_id);
CREATE INDEX IF NOT EXISTS idx_documents_application ON public.application_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_reviews_application ON public.application_reviews(application_id);
CREATE INDEX IF NOT EXISTS idx_activity_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.activity_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zoning_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Basic - adjust based on your security requirements)

-- Users: Users can read their own data, admins can read all
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Development Applications: All authenticated users can read, assigned users can update
CREATE POLICY "Authenticated users can view applications" ON public.development_applications
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create applications" ON public.development_applications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Assigned users can update applications" ON public.development_applications
  FOR UPDATE USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'planner')
    )
  );

-- Similar policies for other tables...
CREATE POLICY "Authenticated users can view zoning" ON public.zoning_districts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view parcels" ON public.land_parcels
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view documents" ON public.application_documents
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zoning_updated_at BEFORE UPDATE ON public.zoning_districts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parcels_updated_at BEFORE UPDATE ON public.land_parcels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.development_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
