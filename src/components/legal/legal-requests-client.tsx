'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, Clock, AlertCircle, CheckCircle, Plus, ArrowRight, Mail, MailOpen, List, Calendar as CalendarIcon, Eye } from 'lucide-react';
import Link from 'next/link';
import { RequestsCalendar } from './requests-calendar';

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

interface LegalRequestsClientProps {
  requests: any[];
  stats: {
    total: number;
    unattended: number;
    pending: number;
    overdue: number;
    completed: number;
  };
}

export function LegalRequestsClient({ requests, stats }: LegalRequestsClientProps) {
  const [activeTab, setActiveTab] = useState('table');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'incoming' | 'outgoing'>('incoming');

  // Filter requests based on direction
  const filteredRequests = directionFilter === 'all'
    ? requests
    : requests.filter(r => (r.direction || 'incoming') === directionFilter);

  const statCards = [
    {
      title: 'Unattended',
      value: stats.unattended,
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'New requests requiring attention',
    },
    {
      title: 'Pending Action',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'In progress or awaiting response',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Past deadline',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Resolved requests',
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Scale className="h-8 w-8 text-green-600" />
            Inter-Division Requisition System
          </h1>
          <p className="text-slate-600 mt-1">
            Track incoming and outgoing requests between all divisions
          </p>
        </div>
        <Link href="/dashboard/legal-requests/new">
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium text-slate-600">
                    {stat.title}
                  </CardTitle>
                  <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
                </div>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs for Table and Calendar View */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="table" className="gap-2">
            <List className="h-4 w-4" />
            Table View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Division Requests</CardTitle>
                  <CardDescription>Inter-division requisitions and requests</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={directionFilter === 'incoming' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDirectionFilter('incoming')}
                  >
                    Incoming ({requests.filter(r => (r.direction || 'incoming') === 'incoming').length})
                  </Button>
                  <Button
                    variant={directionFilter === 'outgoing' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDirectionFilter('outgoing')}
                  >
                    Outgoing ({requests.filter(r => r.direction === 'outgoing').length})
                  </Button>
                  <Button
                    variant={directionFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDirectionFilter('all')}
                  >
                    All ({requests.length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <Scale className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-500 mb-4">No legal requests yet</p>
                  <Link href="/dashboard/legal-requests/new">
                    <Button className="bg-green-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Request
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                          Request #
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                          {directionFilter === 'outgoing' ? 'To Division' : 'From Division'}
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                          Subject
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                          SLA
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                          Urgency
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((request: any) => {
                        const isOverdue = request.is_overdue;
                        const daysRemaining = request.days_remaining || 0;
                        const isUnattended = request.status === 'submitted' || request.status === 'received';

                        return (
                          <tr
                            key={request.id}
                            className={`
                              border-b border-slate-100 hover:bg-slate-50 transition-colors
                              ${isUnattended ? 'bg-blue-50/50 font-semibold' : ''}
                            `}
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                {isUnattended && (
                                  <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                                )}
                                {!isUnattended && (
                                  <MailOpen className="h-4 w-4 text-slate-400 shrink-0" />
                                )}
                                <div>
                                  <span className="text-sm font-medium text-slate-900">
                                    {request.request_number}
                                  </span>
                                  {isOverdue && (
                                    <Badge variant="outline" className="ml-2 bg-red-50 text-red-600 border-red-200 text-xs">
                                      OVERDUE
                                    </Badge>
                                  )}
                                  {isUnattended && (
                                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                      NEW
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-xs font-medium text-slate-700">
                                {request.direction === 'outgoing'
                                  ? (request.receiving_division || 'Not specified')
                                  : (request.requesting_division || 'Legal Division')}
                              </span>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {request.contact_person_name || request.legal_officer_name || '-'}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-slate-900">{request.subject}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-xs text-slate-600">
                                {requestTypeLabels[request.request_type] || request.request_type}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="outline" className={statusColors[request.status]}>
                                {request.status.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-xs">
                                {request.due_date ? (
                                  <span className={isOverdue ? 'text-red-600 font-semibold' : 'text-slate-600'}>
                                    {daysRemaining > 0 ? `${daysRemaining} days left` :
                                     daysRemaining === 0 ? 'Due today' :
                                     `${Math.abs(daysRemaining)} days overdue`}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">No deadline</span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="outline" className={urgencyColors[request.urgency]}>
                                {request.urgency}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link href={`/dashboard/legal-requests/${request.id}`}>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <RequestsCalendar requests={requests} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
