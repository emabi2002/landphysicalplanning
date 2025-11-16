import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Calendar, User, DollarSign, Building, MapPin } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

async function getApplication(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('development_applications')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
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

const priorityColors: Record<string, string> = {
  low: 'bg-slate-100 text-slate-600 border-slate-200',
  normal: 'bg-blue-100 text-blue-600 border-blue-200',
  high: 'bg-orange-100 text-orange-600 border-orange-200',
  urgent: 'bg-red-100 text-red-600 border-red-200',
};

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = await getApplication(id);

  if (!application) {
    notFound();
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/applications">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{application.project_title}</h1>
          <p className="text-slate-600 mt-1">Application #{application.application_number}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className={statusColors[application.status]}>
            {application.status.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" className={priorityColors[application.priority]}>
            {application.priority} priority
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-700">Application Type</p>
                <p className="text-sm text-slate-900">{typeLabels[application.application_type]}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-700">Proposed Use</p>
                <p className="text-sm text-slate-900">{application.proposed_use || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-700">Estimated Cost</p>
                <p className="text-sm text-slate-900">
                  {application.estimated_cost
                    ? `$${application.estimated_cost.toLocaleString()}`
                    : 'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-700">Submitted Date</p>
                <p className="text-sm text-slate-900">
                  {format(new Date(application.submitted_date), 'PPP')}
                </p>
              </div>
            </div>

            {application.review_deadline && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Review Deadline</p>
                  <p className="text-sm text-slate-900">
                    {format(new Date(application.review_deadline), 'PPP')}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-700">Name</p>
                <p className="text-sm text-slate-900">{application.applicant_name}</p>
              </div>
            </div>

            {application.applicant_email && (
              <div>
                <p className="text-sm font-medium text-slate-700">Email</p>
                <p className="text-sm text-slate-900">{application.applicant_email}</p>
              </div>
            )}

            {application.applicant_phone && (
              <div>
                <p className="text-sm font-medium text-slate-700">Phone</p>
                <p className="text-sm text-slate-900">{application.applicant_phone}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700 leading-relaxed">
            {application.project_description || 'No description provided'}
          </p>
        </CardContent>
      </Card>

      {application.decision_date && (
        <Card>
          <CardHeader>
            <CardTitle>Decision</CardTitle>
            <CardDescription>
              Decision made on {format(new Date(application.decision_date), 'PPP')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 leading-relaxed">
              {application.decision_notes || 'No decision notes available'}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button>Update Status</Button>
        <Button variant="outline">Add Document</Button>
        <Button variant="outline">Schedule Inspection</Button>
      </div>
    </div>
  );
}
