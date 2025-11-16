import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { Plus, FolderOpen, AlertTriangle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

async function getComplianceRecords() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('compliance_records')
    .select('*')
    .order('reported_date', { ascending: false });

  if (error) {
    console.error('Error fetching compliance records:', error);
    return [];
  }

  return data || [];
}

const statusColors: Record<string, string> = {
  reported: 'bg-blue-100 text-blue-800 border-blue-200',
  under_investigation: 'bg-purple-100 text-purple-800 border-purple-200',
  confirmed: 'bg-orange-100 text-orange-800 border-orange-200',
  enforcement_action: 'bg-red-100 text-red-800 border-red-200',
  corrective_action_required: 'bg-amber-100 text-amber-800 border-amber-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-slate-100 text-slate-800 border-slate-200',
  dismissed: 'bg-slate-100 text-slate-600 border-slate-200',
};

const severityColors: Record<string, string> = {
  minor: 'bg-blue-100 text-blue-700 border-blue-200',
  moderate: 'bg-amber-100 text-amber-700 border-amber-200',
  major: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

const violationLabels: Record<string, string> = {
  unauthorized_development: 'Unauthorized Development',
  zoning_violation: 'Zoning Violation',
  building_code_violation: 'Building Code Violation',
  environmental_violation: 'Environmental Violation',
  permit_violation: 'Permit Violation',
  land_use_violation: 'Land Use Violation',
  setback_violation: 'Setback Violation',
  height_violation: 'Height Violation',
  other: 'Other',
};

export default async function CompliancePage() {
  const records = await getComplianceRecords();
  const active = records.filter(r => !['resolved', 'closed', 'dismissed'].includes(r.status));
  const critical = records.filter(r => r.severity === 'critical');

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Compliance Monitoring</h1>
          <p className="text-slate-600 mt-1">Track violations and enforcement actions</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          Report Violation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{active.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{critical.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {records.filter(r => r.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{records.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Records */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Cases</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 mb-4">No compliance cases found</p>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="mr-2 h-4 w-4" />
                Report First Violation
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Case #
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Violation Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Severity
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Reported
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {record.severity === 'critical' && (
                            <ShieldAlert className="h-4 w-4 text-red-600" />
                          )}
                          {record.severity === 'major' && (
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                          )}
                          <span className="text-sm font-medium text-slate-900">
                            {record.case_number}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">
                          {violationLabels[record.violation_type] || record.violation_type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-900 line-clamp-2">
                          {record.violation_description}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={severityColors[record.severity]}>
                          {record.severity}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={statusColors[record.status]}>
                          {record.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">
                          {formatDistanceToNow(new Date(record.reported_date), { addSuffix: true })}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
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
