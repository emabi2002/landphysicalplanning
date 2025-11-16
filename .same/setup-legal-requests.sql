-- ============================================
-- QUICK SETUP: Legal Planning Requests Table
-- ============================================
-- Copy and paste this into your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create legal_planning_requests table
CREATE TABLE IF NOT EXISTS public.legal_planning_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_number TEXT UNIQUE NOT NULL,

  -- Legal Division Information
  legal_case_id TEXT,
  legal_case_number TEXT,
  legal_officer_name TEXT,
  legal_officer_email TEXT,
  legal_officer_phone TEXT,
  legal_division_ref TEXT,

  -- Request Details
  request_type TEXT NOT NULL CHECK (request_type IN (
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
    'other'
  )),
  subject TEXT NOT NULL,
  description TEXT,
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),

  -- Related Records (these may reference tables that don't exist yet - nullable)
  parcel_id UUID,
  application_id UUID,

  -- Assignment & Workflow
  assigned_to UUID,
  assigned_by UUID,
  assigned_at TIMESTAMP WITH TIME ZONE,

  -- Status & Tracking
  status TEXT DEFAULT 'submitted' CHECK (status IN (
    'submitted',
    'received',
    'assigned',
    'in_progress',
    'pending_information',
    'under_review',
    'completed',
    'returned_to_legal',
    'closed'
  )),

  -- SLA & Deadlines
  submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  received_at TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  sla_days INTEGER DEFAULT 10,
  is_overdue BOOLEAN GENERATED ALWAYS AS (
    CASE
      WHEN completed_at IS NULL AND due_date < NOW() THEN TRUE
      ELSE FALSE
    END
  ) STORED,
  days_remaining INTEGER GENERATED ALWAYS AS (
    EXTRACT(DAY FROM (due_date - NOW()))::INTEGER
  ) STORED,

  -- Response
  response_summary TEXT,
  findings TEXT,
  recommendations TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated_by UUID
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_legal_requests_status ON public.legal_planning_requests(status);
CREATE INDEX IF NOT EXISTS idx_legal_requests_due_date ON public.legal_planning_requests(due_date);
CREATE INDEX IF NOT EXISTS idx_legal_requests_created_at ON public.legal_planning_requests(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.legal_planning_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (adjust based on your auth needs)
CREATE POLICY "Allow all for authenticated users" ON public.legal_planning_requests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow for anonymous users in development mode
CREATE POLICY "Allow all for anonymous users" ON public.legal_planning_requests
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================
-- INSERT SAMPLE DATA FOR TESTING
-- ============================================

-- Generate some sample legal requests
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

-- Success message
SELECT 'Legal Planning Requests table created successfully with sample data!' AS message;
SELECT COUNT(*) AS total_requests FROM public.legal_planning_requests;
SELECT status, COUNT(*) AS count FROM public.legal_planning_requests GROUP BY status;
