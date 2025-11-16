import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

async function getRecentApplications() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('development_applications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching recent applications:', error);
    return [];
  }

  return data || [];
}

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800 border-blue-200',
  under_review: 'bg-amber-100 text-amber-800 border-amber-200',
  pending_info: 'bg-red-100 text-red-800 border-red-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-slate-100 text-slate-800 border-slate-200',
  withdrawn: 'bg-slate-100 text-slate-800 border-slate-200',
};

const priorityColors: Record<string, string> = {
  low: 'bg-slate-100 text-slate-600 border-slate-200',
  normal: 'bg-blue-100 text-blue-600 border-blue-200',
  high: 'bg-orange-100 text-orange-600 border-orange-200',
  urgent: 'bg-red-100 text-red-600 border-red-200',
};

export async function RecentApplications() {
  const applications = await getRecentApplications();

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest development applications submitted</CardDescription>
          </div>
          <Link href="/dashboard/applications">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No applications yet. Applications will appear here once submitted.
            </p>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {app.project_title}
                    </p>
                    <Badge variant="outline" className={priorityColors[app.priority]}>
                      {app.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{app.applicant_name}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{app.application_number}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <Badge variant="outline" className={statusColors[app.status]}>
                    {app.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
