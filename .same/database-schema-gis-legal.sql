-- ============================================
-- PHYSICAL PLANNING GIS & LEGAL INTEGRATION
-- Extended Database Schema
-- ============================================
-- Execute this AFTER the main database-schema.sql

-- Enable PostGIS extension for spatial operations (optional but recommended)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- 1. SPATIAL DATA ENHANCEMENTS
-- ============================================

-- Add geometry column to land_parcels if PostGIS is enabled
-- ALTER TABLE public.land_parcels ADD COLUMN IF NOT EXISTS geometry geometry(Polygon, 4326);

-- Create spatial index
-- CREATE INDEX IF NOT EXISTS idx_parcels_geometry ON public.land_parcels USING GIST (geometry);

-- Update land_parcels to store better coordinate data
ALTER TABLE public.land_parcels
ADD COLUMN IF NOT EXISTS geojson JSONB,
ADD COLUMN IF NOT EXISTS center_lat DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS center_lng DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS boundary_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_survey_date DATE;

-- Add spatial metadata to zoning_districts
ALTER TABLE public.zoning_districts
ADD COLUMN IF NOT EXISTS geojson JSONB,
ADD COLUMN IF NOT EXISTS area_sqm DECIMAL(15, 2);

-- ============================================
-- 2. LEGAL PLANNING REQUESTS
-- ============================================

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

  -- Related Records
  parcel_id UUID REFERENCES public.land_parcels(id),
  application_id UUID REFERENCES public.development_applications(id),

  -- Assignment & Workflow
  assigned_to UUID REFERENCES public.users(id),
  assigned_by UUID REFERENCES public.users(id),
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
  last_updated_by UUID REFERENCES public.users(id)
);

-- ============================================
-- 3. LEGAL REQUEST DOCUMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS public.legal_request_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_id UUID REFERENCES public.legal_planning_requests(id) ON DELETE CASCADE,
  document_type TEXT CHECK (document_type IN (
    'legal_request_letter',
    'court_order',
    'zoning_certificate',
    'inspection_report',
    'site_photos',
    'survey_plan',
    'gis_plot',
    'compliance_report',
    'officer_memo',
    'response_letter',
    'spatial_evidence',
    'other'
  )),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES public.users(id),
  direction TEXT CHECK (direction IN ('from_legal', 'to_legal')),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. NOTIFICATIONS SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Notification Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'legal_request',
    'application_update',
    'inspection_scheduled',
    'deadline_warning',
    'overdue_alert',
    'assignment',
    'status_change',
    'document_uploaded',
    'escalation',
    'general'
  )),
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'urgent', 'critical')),

  -- Related Records
  related_entity_type TEXT CHECK (related_entity_type IN (
    'legal_request',
    'application',
    'parcel',
    'inspection',
    'compliance_record'
  )),
  related_entity_id UUID,

  -- Action
  action_url TEXT,
  action_label TEXT,

  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,

  -- Delivery
  sent_email BOOLEAN DEFAULT FALSE,
  sent_sms BOOLEAN DEFAULT FALSE,
  sent_push BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. LEGAL REQUEST ACTIVITY LOG
-- ============================================

CREATE TABLE IF NOT EXISTS public.legal_request_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_id UUID REFERENCES public.legal_planning_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),

  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'created',
    'received',
    'assigned',
    'status_changed',
    'comment_added',
    'document_uploaded',
    'response_sent',
    'deadline_extended',
    'escalated',
    'completed',
    'reopened'
  )),

  old_value TEXT,
  new_value TEXT,
  comment TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. SPATIAL EVIDENCE
-- ============================================

CREATE TABLE IF NOT EXISTS public.spatial_evidence (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Related Records
  request_id UUID REFERENCES public.legal_planning_requests(id),
  parcel_id UUID REFERENCES public.land_parcels(id),
  inspection_id UUID REFERENCES public.site_inspections(id),

  -- Evidence Details
  evidence_type TEXT CHECK (evidence_type IN (
    'site_photo',
    'gps_coordinate',
    'boundary_marker',
    'encroachment',
    'unauthorized_structure',
    'compliance_violation',
    'site_condition',
    'other'
  )),
  description TEXT,

  -- Spatial Data
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  accuracy_meters DECIMAL(6, 2),

  -- Media
  photo_url TEXT,
  photo_thumbnail_url TEXT,

  -- Metadata
  captured_by UUID REFERENCES public.users(id),
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_info JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. OFFICER WORKLOAD TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS public.officer_workload (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  officer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Workload Metrics
  active_requests INTEGER DEFAULT 0,
  active_applications INTEGER DEFAULT 0,
  active_inspections INTEGER DEFAULT 0,

  -- Performance Metrics
  avg_completion_days DECIMAL(5, 2),
  requests_completed_this_month INTEGER DEFAULT 0,
  requests_overdue INTEGER DEFAULT 0,

  -- Availability
  planning_area TEXT,
  max_concurrent_requests INTEGER DEFAULT 10,
  is_available BOOLEAN DEFAULT TRUE,

  -- Last updated
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. SPATIAL LAYERS METADATA
-- ============================================

CREATE TABLE IF NOT EXISTS public.spatial_layers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  layer_name TEXT NOT NULL,
  layer_type TEXT CHECK (layer_type IN (
    'parcels',
    'zoning',
    'roads',
    'utilities_water',
    'utilities_electricity',
    'utilities_sewer',
    'drainage',
    'urban_boundaries',
    'planning_zones',
    'protected_areas',
    'development_sites'
  )),
  description TEXT,
  geojson_url TEXT,
  wms_url TEXT,
  tile_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER,
  default_visible BOOLEAN DEFAULT TRUE,
  style_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 9. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_legal_requests_status ON public.legal_planning_requests(status);
CREATE INDEX IF NOT EXISTS idx_legal_requests_assigned ON public.legal_planning_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_legal_requests_parcel ON public.legal_planning_requests(parcel_id);
CREATE INDEX IF NOT EXISTS idx_legal_requests_due ON public.legal_planning_requests(due_date);
CREATE INDEX IF NOT EXISTS idx_legal_requests_overdue ON public.legal_planning_requests(is_overdue) WHERE is_overdue = TRUE;

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

CREATE INDEX IF NOT EXISTS idx_evidence_request ON public.spatial_evidence(request_id);
CREATE INDEX IF NOT EXISTS idx_evidence_parcel ON public.spatial_evidence(parcel_id);
CREATE INDEX IF NOT EXISTS idx_evidence_coords ON public.spatial_evidence(latitude, longitude);

-- ============================================
-- 10. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.legal_planning_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_request_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_request_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spatial_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_workload ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spatial_layers ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Legal requests: All authenticated users can view
CREATE POLICY "Users can view legal requests" ON public.legal_planning_requests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Officers can update assigned requests" ON public.legal_planning_requests
  FOR UPDATE USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'planner')
    )
  );

-- Notifications: Users see only their own
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Spatial evidence: All authenticated users can view
CREATE POLICY "Users can view spatial evidence" ON public.spatial_evidence
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- 11. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to auto-assign requests based on workload
CREATE OR REPLACE FUNCTION auto_assign_legal_request()
RETURNS TRIGGER AS $$
DECLARE
  selected_officer UUID;
BEGIN
  -- Find officer with lowest workload in relevant planning area
  SELECT officer_id INTO selected_officer
  FROM public.officer_workload
  WHERE is_available = TRUE
  ORDER BY active_requests ASC, active_applications ASC
  LIMIT 1;

  IF selected_officer IS NOT NULL THEN
    NEW.assigned_to := selected_officer;
    NEW.assigned_at := NOW();
    NEW.status := 'assigned';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-assignment (optional - can be manual)
-- CREATE TRIGGER auto_assign_legal_request_trigger
--   BEFORE INSERT ON public.legal_planning_requests
--   FOR EACH ROW
--   WHEN (NEW.assigned_to IS NULL)
--   EXECUTE FUNCTION auto_assign_legal_request();

-- Function to create notification
CREATE OR REPLACE FUNCTION create_legal_request_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify assigned officer
  IF NEW.assigned_to IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      severity,
      related_entity_type,
      related_entity_id,
      action_url
    ) VALUES (
      NEW.assigned_to,
      'New Legal Request Assigned',
      'Legal request ' || NEW.request_number || ' has been assigned to you: ' || NEW.subject,
      'legal_request',
      CASE WHEN NEW.urgency = 'urgent' THEN 'urgent' ELSE 'info' END,
      'legal_request',
      NEW.id,
      '/dashboard/legal-requests/' || NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_legal_request_assignment
  AFTER INSERT OR UPDATE OF assigned_to ON public.legal_planning_requests
  FOR EACH ROW
  WHEN (NEW.assigned_to IS NOT NULL)
  EXECUTE FUNCTION create_legal_request_notification();

-- Function to update activity log
CREATE OR REPLACE FUNCTION log_legal_request_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF OLD.status != NEW.status THEN
      INSERT INTO public.legal_request_activity (
        request_id, user_id, activity_type, old_value, new_value
      ) VALUES (
        NEW.id, auth.uid(), 'status_changed', OLD.status, NEW.status
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_legal_request_changes_trigger
  AFTER UPDATE ON public.legal_planning_requests
  FOR EACH ROW
  EXECUTE FUNCTION log_legal_request_changes();

-- Updated at trigger
CREATE TRIGGER update_legal_requests_updated_at
  BEFORE UPDATE ON public.legal_planning_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spatial_layers_updated_at
  BEFORE UPDATE ON public.spatial_layers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 12. SAMPLE DATA (Optional)
-- ============================================

-- Insert sample spatial layer
INSERT INTO public.spatial_layers (layer_name, layer_type, description, default_visible) VALUES
('Land Parcels', 'parcels', 'All registered land parcels', true),
('Zoning Districts', 'zoning', 'Planning zoning districts', true),
('Road Network', 'roads', 'Main road network', false),
('Water Utilities', 'utilities_water', 'Water supply network', false)
ON CONFLICT DO NOTHING;

-- ============================================
-- NOTES
-- ============================================

-- 1. PostGIS Extension: Uncomment PostGIS-related SQL if you enable PostGIS
-- 2. Auto-assignment: The auto-assignment trigger is commented out - enable if needed
-- 3. SMS Integration: Set up via Supabase Edge Functions
-- 4. Email Integration: Configure SMTP or use Supabase Edge Functions
-- 5. Real-time: Enable Supabase Realtime for tables that need live updates

-- Enable Realtime for key tables:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.legal_planning_requests;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.spatial_evidence;
