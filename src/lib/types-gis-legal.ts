// GIS & Legal Integration Types

export type LegalRequestType =
  | 'zoning_confirmation'
  | 'zoning_change_verification'
  | 'development_approval_verification'
  | 'compliance_investigation_request'
  | 'unauthorized_development_report'
  | 'parcel_history_request'
  | 'inspection_findings_request'
  | 'spatial_evidence_request'
  | 'boundary_dispute_assessment'
  | 'planning_opinion'
  | 'other';

export type LegalRequestStatus =
  | 'submitted'
  | 'received'
  | 'assigned'
  | 'in_progress'
  | 'pending_information'
  | 'under_review'
  | 'completed'
  | 'returned_to_legal'
  | 'closed';

export type LegalRequestUrgency = 'low' | 'normal' | 'high' | 'urgent';

export interface LegalPlanningRequest {
  id: string;
  request_number: string;

  // Legal Division Info
  legal_case_id?: string;
  legal_case_number?: string;
  legal_officer_name?: string;
  legal_officer_email?: string;
  legal_officer_phone?: string;
  legal_division_ref?: string;

  // Request Details
  request_type: LegalRequestType;
  subject: string;
  description?: string;
  urgency: LegalRequestUrgency;

  // Related Records
  parcel_id?: string;
  application_id?: string;

  // Assignment
  assigned_to?: string;
  assigned_by?: string;
  assigned_at?: string;

  // Status
  status: LegalRequestStatus;

  // SLA
  submitted_date: string;
  received_at?: string;
  due_date?: string;
  completed_at?: string;
  sla_days: number;
  is_overdue: boolean;
  days_remaining?: number;

  // Response
  response_summary?: string;
  findings?: string;
  recommendations?: string;

  // Metadata
  created_at: string;
  updated_at: string;
  last_updated_by?: string;
}

export type LegalDocumentType =
  | 'legal_request_letter'
  | 'court_order'
  | 'zoning_certificate'
  | 'inspection_report'
  | 'site_photos'
  | 'survey_plan'
  | 'gis_plot'
  | 'compliance_report'
  | 'officer_memo'
  | 'response_letter'
  | 'spatial_evidence'
  | 'other';

export interface LegalRequestDocument {
  id: string;
  request_id: string;
  document_type: LegalDocumentType;
  file_name: string;
  file_url: string;
  file_size?: number;
  uploaded_by?: string;
  direction: 'from_legal' | 'to_legal';
  uploaded_at: string;
}

export type NotificationType =
  | 'legal_request'
  | 'application_update'
  | 'inspection_scheduled'
  | 'deadline_warning'
  | 'overdue_alert'
  | 'assignment'
  | 'status_change'
  | 'document_uploaded'
  | 'escalation'
  | 'general';

export type NotificationSeverity = 'info' | 'warning' | 'urgent' | 'critical';

export interface Notification {
  id: string;
  user_id: string;

  // Content
  title: string;
  message: string;
  type: NotificationType;
  severity: NotificationSeverity;

  // Related Entity
  related_entity_type?: 'legal_request' | 'application' | 'parcel' | 'inspection' | 'compliance_record';
  related_entity_id?: string;

  // Action
  action_url?: string;
  action_label?: string;

  // Status
  is_read: boolean;
  is_dismissed: boolean;
  read_at?: string;

  // Delivery
  sent_email: boolean;
  sent_sms: boolean;
  sent_push: boolean;

  created_at: string;
}

export type ActivityType =
  | 'created'
  | 'received'
  | 'assigned'
  | 'status_changed'
  | 'comment_added'
  | 'document_uploaded'
  | 'response_sent'
  | 'deadline_extended'
  | 'escalated'
  | 'completed'
  | 'reopened';

export interface LegalRequestActivity {
  id: string;
  request_id: string;
  user_id?: string;
  activity_type: ActivityType;
  old_value?: string;
  new_value?: string;
  comment?: string;
  created_at: string;
}

export type SpatialEvidenceType =
  | 'site_photo'
  | 'gps_coordinate'
  | 'boundary_marker'
  | 'encroachment'
  | 'unauthorized_structure'
  | 'compliance_violation'
  | 'site_condition'
  | 'other';

export interface SpatialEvidence {
  id: string;
  request_id?: string;
  parcel_id?: string;
  inspection_id?: string;

  evidence_type: SpatialEvidenceType;
  description?: string;

  // Spatial
  latitude?: number;
  longitude?: number;
  accuracy_meters?: number;

  // Media
  photo_url?: string;
  photo_thumbnail_url?: string;

  // Metadata
  captured_by?: string;
  captured_at: string;
  device_info?: Record<string, any>;

  created_at: string;
}

export interface OfficerWorkload {
  id: string;
  officer_id: string;

  // Workload
  active_requests: number;
  active_applications: number;
  active_inspections: number;

  // Performance
  avg_completion_days?: number;
  requests_completed_this_month: number;
  requests_overdue: number;

  // Availability
  planning_area?: string;
  max_concurrent_requests: number;
  is_available: boolean;

  last_calculated_at: string;
}

export type SpatialLayerType =
  | 'parcels'
  | 'zoning'
  | 'roads'
  | 'utilities_water'
  | 'utilities_electricity'
  | 'utilities_sewer'
  | 'drainage'
  | 'urban_boundaries'
  | 'planning_zones'
  | 'protected_areas'
  | 'development_sites';

export interface SpatialLayer {
  id: string;
  layer_name: string;
  layer_type: SpatialLayerType;
  description?: string;
  geojson_url?: string;
  wms_url?: string;
  tile_url?: string;
  is_active: boolean;
  display_order?: number;
  default_visible: boolean;
  style_config?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// GeoJSON Types
export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'Point' | 'LineString' | 'MultiPolygon';
    coordinates: number[][] | number[][][] | number[][][][];
  };
  properties?: Record<string, any>;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}
