import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET all legal requests or filter by query params
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const urgency = searchParams.get('urgency');
    const legal_case_number = searchParams.get('legal_case_number');
    const assigned_to = searchParams.get('assigned_to');

    let query = supabase
      .from('legal_planning_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (urgency) query = query.eq('urgency', urgency);
    if (legal_case_number) query = query.eq('legal_case_number', legal_case_number);
    if (assigned_to) query = query.eq('assigned_to', assigned_to);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching legal requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch legal requests' },
      { status: 500 }
    );
  }
}

// POST create new legal request
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Generate request number if not provided
    if (!body.request_number) {
      body.request_number = `LR-${Date.now()}`;
    }

    // Calculate due date if not provided
    if (!body.due_date && body.sla_days) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + parseInt(body.sla_days));
      body.due_date = dueDate.toISOString();
    }

    // Set default status
    if (!body.status) {
      body.status = 'submitted';
    }

    const { data, error } = await supabase
      .from('legal_planning_requests')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    // Create initial activity log
    await supabase.from('legal_request_activity').insert([
      {
        request_id: data.id,
        activity_type: 'created',
        comment: 'Request submitted from Legal Division',
      },
    ]);

    return NextResponse.json({
      success: true,
      data,
      message: 'Legal request created successfully',
    });
  } catch (error) {
    console.error('Error creating legal request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create legal request' },
      { status: 500 }
    );
  }
}
