import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET all legal-relevant information for a parcel
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get parcel details
    const { data: parcel, error: parcelError } = await supabase
      .from('land_parcels')
      .select(`
        *,
        zoning_districts(id, name, code, description, color, regulations)
      `)
      .eq('id', id)
      .single();

    if (parcelError) throw parcelError;

    // Get development applications for this parcel
    const { data: applications } = await supabase
      .from('development_applications')
      .select('*')
      .eq('parcel_id', id)
      .order('submitted_date', { ascending: false });

    // Get legal requests related to this parcel
    const { data: legalRequests } = await supabase
      .from('legal_planning_requests')
      .select(`
        *,
        assigned_user:users!legal_planning_requests_assigned_to_fkey(full_name, email)
      `)
      .eq('parcel_id', id)
      .order('submitted_date', { ascending: false });

    // Get compliance records
    const { data: compliance } = await supabase
      .from('compliance_records')
      .select('*')
      .eq('parcel_id', id)
      .order('reported_date', { ascending: false });

    // Get site inspections
    const { data: inspections } = await supabase
      .from('site_inspections')
      .select(`
        *,
        development_applications(application_number, project_title)
      `)
      .eq('parcel_id', id)
      .order('inspection_date', { ascending: false});

    // Get spatial evidence
    const { data: evidence } = await supabase
      .from('spatial_evidence')
      .select('*')
      .eq('parcel_id', id)
      .order('captured_at', { ascending: false });

    return NextResponse.json({
      success: true,
      data: {
        parcel,
        zoning: parcel?.zoning_districts,
        applications: applications || [],
        legal_requests: legalRequests || [],
        compliance_records: compliance || [],
        inspections: inspections || [],
        spatial_evidence: evidence || [],
        summary: {
          total_applications: applications?.length || 0,
          total_legal_requests: legalRequests?.length || 0,
          pending_legal_requests: legalRequests?.filter(r =>
            ['submitted', 'received', 'assigned', 'in_progress'].includes(r.status)
          ).length || 0,
          compliance_violations: compliance?.filter(c => c.status === 'open').length || 0,
          inspections_count: inspections?.length || 0,
          evidence_count: evidence?.length || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching parcel legal info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch parcel information' },
      { status: 500 }
    );
  }
}
