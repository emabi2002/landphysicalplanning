import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

async function getAllApplications() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('development_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
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

const typeLabels: Record<string, string> = {
  building_permit: 'Building Permit',
  subdivision: 'Subdivision',
  change_of_use: 'Change of Use',
  rezoning: 'Rezoning',
  site_plan_approval: 'Site Plan Approval',
  variance: 'Variance',
  special_permit: 'Special Permit',
};

export default async function ApplicationsPage() {
  const applications = await getAllApplications();

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Development Applications</h1>
          <p className="text-slate-600 mt-1">Manage and track all development applications</p>
        </div>
        <Link href="/dashboard/applications/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">No applications found</p>
              <Link href="/dashboard/applications/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Application
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Application #
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Project Title
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Applicant
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Submitted
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-slate-900">
                          {app.application_number}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-900">{app.project_title}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">{app.applicant_name}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">
                          {typeLabels[app.application_type] || app.application_type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={statusColors[app.status]}>
                          {app.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">
                          {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link href={`/dashboard/applications/${app.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
