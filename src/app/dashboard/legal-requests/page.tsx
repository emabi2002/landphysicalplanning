import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { Scale, Clock, AlertCircle, CheckCircle, Plus, ArrowRight, Mail, MailOpen } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { LegalRequestsClient } from '@/components/legal/legal-requests-client';

async function getLegalRequests() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('legal_planning_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching legal requests:', error);
    return [];
  }

  return data || [];
}

async function getRequestStats() {
  const supabase = await createClient();

  try {
    const { count: total } = await supabase
      .from('legal_planning_requests')
      .select('*', { count: 'exact', head: true });

    const { count: unattended } = await supabase
      .from('legal_planning_requests')
      .select('*', { count: 'exact', head: true })
      .in('status', ['submitted', 'received']);

    const { count: pending } = await supabase
      .from('legal_planning_requests')
      .select('*', { count: 'exact', head: true })
      .in('status', ['submitted', 'received', 'assigned', 'in_progress']);

    const { count: overdue } = await supabase
      .from('legal_planning_requests')
      .select('*', { count: 'exact', head: true })
      .eq('is_overdue', true);

    const { count: completed } = await supabase
      .from('legal_planning_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    return {
      total: total || 0,
      unattended: unattended || 0,
      pending: pending || 0,
      overdue: overdue || 0,
      completed: completed || 0,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { total: 0, unattended: 0, pending: 0, overdue: 0, completed: 0 };
  }
}

export default async function LegalRequestsPage() {
  const requests = await getLegalRequests();
  const stats = await getRequestStats();

  return <LegalRequestsClient requests={requests} stats={stats} />;
}
