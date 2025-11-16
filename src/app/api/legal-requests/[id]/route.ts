import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET single legal request by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('legal_planning_requests')
      .select(`
        *,
        land_parcels(id, parcel_number, address, area_sqm, owner_name, geojson),
        development_applications(id, application_number, project_title, status),
        assigned_user:users!legal_planning_requests_assigned_to_fkey(full_name, email, department, phone)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Get documents
    const { data: documents } = await supabase
      .from('legal_request_documents')
      .select('*')
      .eq('request_id', id)
      .order('uploaded_at', { ascending: false });

    // Get activity
    const { data: activity } = await supabase
      .from('legal_request_activity')
      .select('*, users(full_name, email)')
      .eq('request_id', id)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        documents: documents || [],
        activity: activity || [],
      },
    });
  } catch (error) {
    console.error('Error fetching legal request:', error);
    return NextResponse.json(
      { success: false, error: 'Legal request not found' },
      { status: 404 }
    );
  }
}

// PATCH update legal request
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    // Get current request to track changes
    const { data: currentRequest } = await supabase
      .from('legal_planning_requests')
      .select('status')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('legal_planning_requests')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log status change if status was updated
    if (body.status && currentRequest && body.status !== currentRequest.status) {
      await supabase.from('legal_request_activity').insert([
        {
          request_id: id,
          activity_type: 'status_changed',
          old_value: currentRequest.status,
          new_value: body.status,
          comment: body.status_comment || null,
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Legal request updated successfully',
    });
  } catch (error) {
    console.error('Error updating legal request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update legal request' },
      { status: 500 }
    );
  }
}

// DELETE legal request (soft delete - set to withdrawn)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('legal_planning_requests')
      .update({
        status: 'withdrawn',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log withdrawal
    await supabase.from('legal_request_activity').insert([
      {
        request_id: id,
        activity_type: 'status_changed',
        new_value: 'withdrawn',
        comment: 'Request withdrawn',
      },
    ]);

    return NextResponse.json({
      success: true,
      data,
      message: 'Legal request withdrawn successfully',
    });
  } catch (error) {
    console.error('Error deleting legal request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to withdraw legal request' },
      { status: 500 }
    );
  }
}
