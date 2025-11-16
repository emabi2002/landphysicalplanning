import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Count requests that are unattended (submitted or received but not yet assigned/in progress)
    const { count, error } = await supabase
      .from('legal_planning_requests')
      .select('*', { count: 'exact', head: true })
      .in('status', ['submitted', 'received']);

    if (error) {
      console.error('Error fetching unread count:', error);
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Error in unread-count API:', error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
