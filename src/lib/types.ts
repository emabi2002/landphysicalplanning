export type UserRole = 'admin' | 'planner' | 'officer' | 'viewer';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department?: string;
  phone?: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export type ApplicationType =
  | 'building_permit'
  | 'subdivision'
  | 'change_of_use'
  | 'rezoning'
  | 'site_plan_approval'
  | 'variance'
  | 'special_permit';

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'pending_info'
  | 'approved'
  | 'rejected'
  | 'withdrawn';

export type ApplicationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface DevelopmentApplication {
  id: string;
  application_number: string;
  applicant_name: string;
  applicant_email?: string;
  applicant_phone?: string;
  parcel_id?: string;
  application_type: ApplicationType;
  project_title: string;
  project_description?: string;
  estimated_cost?: number;
  proposed_use?: string;
  status: ApplicationStatus;
  priority: ApplicationPriority;
  assigned_to?: string;
  submitted_date: string;
  review_deadline?: string;
  decision_date?: string;
  decision_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ZoningDistrict {
  id: string;
  name: string;
  code: string;
  description?: string;
  color?: string;
  regulations?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LandParcel {
  id: string;
  parcel_number: string;
  address: string;
  area_sqm?: number;
  zoning_district_id?: string;
  owner_name?: string;
  owner_contact?: string;
  coordinates?: Record<string, any>;
  land_use?: string;
  status: 'registered' | 'disputed' | 'pending';
  created_at: string;
  updated_at: string;
}

export type DocumentType =
  | 'site_plan'
  | 'architectural_drawing'
  | 'survey_plan'
  | 'environmental_study'
  | 'traffic_study'
  | 'title_deed'
  | 'identity_document'
  | 'other';

export interface ApplicationDocument {
  id: string;
  application_id: string;
  document_type: DocumentType;
  file_name: string;
  file_url: string;
  file_size?: number;
  uploaded_by?: string;
  uploaded_at: string;
}

export type ReviewStage =
  | 'initial_screening'
  | 'technical_review'
  | 'site_inspection'
  | 'public_consultation'
  | 'final_decision';

export type ReviewStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold';

export interface ApplicationReview {
  id: string;
  application_id: string;
  reviewer_id?: string;
  review_stage: ReviewStage;
  status: ReviewStatus;
  comments?: string;
  recommendations?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface DashboardStats {
  total_applications: number;
  pending_applications: number;
  approved_this_month: number;
  under_review: number;
  total_parcels: number;
  active_inspections: number;
}
