import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET spatial evidence by request, parcel, or inspection
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const request_id = searchParams.get('request_id');
    const parcel_id = searchParams.get('parcel_id');
    const inspection_id = searchParams.get('inspection_id');
    const evidence_type = searchParams.get('evidence_type');

    let query = supabase
      .from('spatial_evidence')
      .select('*')
      .order('captured_at', { ascending: false });

    if (request_id) query = query.eq('request_id', request_id);
    if (parcel_id) query = query.eq('parcel_id', parcel_id);
    if (inspection_id) query = query.eq('inspection_id', inspection_id);
    if (evidence_type) query = query.eq('evidence_type', evidence_type);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching spatial evidence:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch spatial evidence' },
      { status: 500 }
    );
  }
}

// POST create new spatial evidence
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('spatial_evidence')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: 'Spatial evidence created successfully',
    });
  } catch (error) {
    console.error('Error creating spatial evidence:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create spatial evidence' },
      { status: 500 }
    );
  }
}
