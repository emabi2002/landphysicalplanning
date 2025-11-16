import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, User, FileText, Activity, MapPin } from 'lucide-react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import { notFound } from 'next/navigation';
import { RequestWorkflow } from '@/components/legal/request-workflow';
import { ResponseForm } from '@/components/legal/response-form';
import { ActivityTimeline } from '@/components/legal/activity-timeline';
import { RequestActions, AssignmentCard } from '@/components/legal/request-actions';

async function getRequest(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('legal_planning_requests')
    .select(`
      *,
      land_parcels(id, parcel_number, address),
      development_applications(id, application_number, project_title),
      assigned_user:users!legal_planning_requests_assigned_to_fkey(full_name, email, department)
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getDocuments(requestId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('legal_request_documents')
    .select('*')
    .eq('request_id', requestId)
    .order('uploaded_at', { ascending: false });

  return data || [];
}

async function getActivity(requestId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('legal_request_activity')
    .select(`
      *,
      users(full_name, email)
    `)
    .eq('request_id', requestId)
    .order('created_at', { ascending: false });

  return data || [];
}

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800 border-blue-200',
  received: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  assigned: 'bg-purple-100 text-purple-800 border-purple-200',
  in_progress: 'bg-amber-100 text-amber-800 border-amber-200',
  pending_information: 'bg-orange-100 text-orange-800 border-orange-200',
  under_review: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  returned_to_legal: 'bg-teal-100 text-teal-800 border-teal-200',
  closed: 'bg-slate-100 text-slate-800 border-slate-200',
};

const urgencyColors: Record<string, string> = {
  low: 'bg-slate-100 text-slate-600 border-slate-200',
  normal: 'bg-blue-100 text-blue-600 border-blue-200',
  high: 'bg-orange-100 text-orange-600 border-orange-200',
  urgent: 'bg-red-100 text-red-600 border-red-200',
};

const requestTypeLabels: Record<string, string> = {
  zoning_confirmation: 'Zoning Confirmation',
  zoning_change_verification: 'Zoning Change Verification',
  development_approval_verification: 'Development Approval Verification',
  compliance_investigation_request: 'Compliance Investigation',
  unauthorized_development_report: 'Unauthorized Development',
  parcel_history_request: 'Parcel History',
  inspection_findings_request: 'Inspection Findings',
  spatial_evidence_request: 'Spatial Evidence',
  boundary_dispute_assessment: 'Boundary Dispute',
  planning_opinion: 'Planning Opinion',
  other: 'Other',
};

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getRequest(id);
  const documents = await getDocuments(id);
  const activity = await getActivity(id);

  if (!request) {
    notFound();
  }

  const isOverdue = request.is_overdue;
  const daysRemaining = request.days_remaining || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/legal-requests">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">
              {request.request_number}
            </h1>
            {isOverdue && (
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                OVERDUE
              </Badge>
            )}
          </div>
          <p className="text-lg text-slate-600">{request.subject}</p>
        </div>

        <div className="flex gap-2 items-start">
          <div className="flex gap-2">
            <Badge variant="outline" className={statusColors[request.status]}>
              {request.status.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className={urgencyColors[request.urgency]}>
              {request.urgency}
            </Badge>
          </div>
          <RequestActions
            requestId={id}
            requestNumber={request.request_number}
            currentStatus={request.status}
            hasAssignedUser={!!request.assigned_user}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Request Type</p>
                  <p className="text-sm font-medium text-slate-900">
                    {requestTypeLabels[request.request_type]}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Legal Case Number</p>
                  <p className="text-sm font-medium text-slate-900">
                    {request.legal_case_number || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Legal Officer</p>
                  <p className="text-sm font-medium text-slate-900">
                    {request.legal_officer_name}
                  </p>
                  {request.legal_officer_email && (
                    <p className="text-xs text-slate-500">{request.legal_officer_email}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-slate-500">Submitted</p>
                  <p className="text-sm font-medium text-slate-900">
                    {format(new Date(request.submitted_date), 'PPP')}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(request.submitted_date), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {request.description && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Description</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {request.description}
                  </p>
                </div>
              )}

              {/* Related Records */}
              {(request.land_parcels || request.development_applications) && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-2">Related Records</p>
                  <div className="space-y-2">
                    {request.land_parcels && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">Parcel:</span>
                        <Link
                          href={`/dashboard/parcels/${request.land_parcels.id}`}
                          className="text-green-600 hover:underline"
                        >
                          {request.land_parcels.parcel_number} - {request.land_parcels.address}
                        </Link>
                      </div>
                    )}
                    {request.development_applications && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">Application:</span>
                        <Link
                          href={`/dashboard/applications/${request.development_applications.id}`}
                          className="text-green-600 hover:underline"
                        >
                          {request.development_applications.application_number} -{' '}
                          {request.development_applications.project_title}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="workflow" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="workflow">
              <RequestWorkflow requestId={id} currentStatus={request.status} />
            </TabsContent>

            <TabsContent value="response">
              <ResponseForm
                requestId={id}
                currentStatus={request.status}
                responseSummary={request.response_summary}
                findings={request.findings}
                recommendations={request.recommendations}
              />
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Attached Documents</CardTitle>
                  <CardDescription>All documents related to this request</CardDescription>
                </CardHeader>
                <CardContent>
                  {documents.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No documents attached yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc: any) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-slate-500" />
                            <div>
                              <p className="text-sm font-medium text-slate-900">{doc.file_name}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>{doc.document_type.replace('_', ' ')}</span>
                                <span>•</span>
                                <span>{doc.direction === 'from_legal' ? 'From Legal' : 'To Legal'}</span>
                                <span>•</span>
                                <span>{format(new Date(doc.uploaded_at), 'PP')}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <ActivityTimeline activities={activity} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SLA Tracking */}
          <Card className={isOverdue ? 'border-red-200' : ''}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                SLA Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">Due Date</p>
                  <p className="text-sm font-semibold">
                    {request.due_date ? format(new Date(request.due_date), 'PPP') : 'Not set'}
                  </p>
                </div>

                {request.due_date && (
                  <div>
                    <p className="text-xs text-slate-500">Time Remaining</p>
                    <p
                      className={`text-lg font-bold ${
                        isOverdue ? 'text-red-600' : daysRemaining <= 2 ? 'text-amber-600' : 'text-green-600'
                      }`}
                    >
                      {daysRemaining > 0
                        ? `${daysRemaining} days left`
                        : daysRemaining === 0
                        ? 'Due today'
                        : `${Math.abs(daysRemaining)} days overdue`}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-slate-500">SLA Period</p>
                  <p className="text-sm font-medium">{request.sla_days} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AssignmentCard
                requestId={id}
                currentStatus={request.status}
                assignedUser={request.assigned_user}
                assignedAt={request.assigned_at}
              />
            </CardContent>
          </Card>

          {/* Response Summary */}
          {request.response_summary && (
            <Card className="border-green-200">
              <CardHeader className="pb-3 bg-green-50">
                <CardTitle className="text-base">Response Submitted</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-slate-700">{request.response_summary}</p>
                {request.completed_at && (
                  <p className="text-xs text-slate-500 mt-2">
                    Completed {format(new Date(request.completed_at), 'PPP')}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
