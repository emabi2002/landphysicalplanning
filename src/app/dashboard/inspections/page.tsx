import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { Plus, ClipboardCheck, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

async function getInspections() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('site_inspections')
    .select('*')
    .order('scheduled_date', { ascending: true });

  if (error) {
    console.error('Error fetching inspections:', error);
    return [];
  }

  return data || [];
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-amber-100 text-amber-800 border-amber-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-slate-100 text-slate-800 border-slate-200',
  rescheduled: 'bg-purple-100 text-purple-800 border-purple-200',
};

const complianceColors: Record<string, string> = {
  compliant: 'bg-green-100 text-green-800 border-green-200',
  non_compliant: 'bg-red-100 text-red-800 border-red-200',
  partial_compliance: 'bg-amber-100 text-amber-800 border-amber-200',
  pending: 'bg-slate-100 text-slate-800 border-slate-200',
};

const typeLabels: Record<string, string> = {
  pre_application: 'Pre-Application',
  initial_site_visit: 'Initial Site Visit',
  construction_progress: 'Construction Progress',
  final_inspection: 'Final Inspection',
  compliance_check: 'Compliance Check',
  violation_investigation: 'Violation Investigation',
  boundary_verification: 'Boundary Verification',
  occupancy_inspection: 'Occupancy Inspection',
};

export default async function InspectionsPage() {
  const inspections = await getInspections();
  const upcoming = inspections.filter(i => i.status === 'scheduled');
  const completed = inspections.filter(i => i.status === 'completed');

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Site Inspections</h1>
          <p className="text-slate-600 mt-1">Schedule and manage site inspections</p>
        </div>
        <Button className="bg-green-600">
          <Plus className="mr-2 h-4 w-4" />
          New Inspection
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{upcoming.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{completed.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{inspections.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Inspections List */}
      <Card>
        <CardHeader>
          <CardTitle>All Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          {inspections.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardCheck className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 mb-4">No inspections scheduled</p>
              <Button className="bg-green-600">
                <Plus className="mr-2 h-4 w-4" />
                Schedule First Inspection
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Inspection #
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Scheduled
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Compliance
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map((inspection) => (
                    <tr key={inspection.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-slate-900">
                          {inspection.inspection_number}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">
                          {typeLabels[inspection.inspection_type] || inspection.inspection_type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-slate-900 line-clamp-2">
                            {inspection.site_address || 'Location not specified'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {inspection.scheduled_date ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {format(new Date(inspection.scheduled_date), 'MMM d, yyyy')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">Not scheduled</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={statusColors[inspection.status]}>
                          {inspection.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {inspection.compliance_status && (
                          <Badge variant="outline" className={complianceColors[inspection.compliance_status]}>
                            {inspection.compliance_status.replace('_', ' ')}
                          </Badge>
                        )}
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
