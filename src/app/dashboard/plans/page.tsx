import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { Plus, Building2, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

async function getDevelopmentPlans() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('development_plans')
    .select('*')
    .order('submitted_date', { ascending: false });

  if (error) {
    console.error('Error fetching development plans:', error);
    return [];
  }

  return data || [];
}

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800 border-blue-200',
  under_review: 'bg-purple-100 text-purple-800 border-purple-200',
  revision_required: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  conditionally_approved: 'bg-teal-100 text-teal-800 border-teal-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  withdrawn: 'bg-slate-100 text-slate-800 border-slate-200',
  expired: 'bg-slate-100 text-slate-600 border-slate-200',
};

const typeLabels: Record<string, string> = {
  subdivision_plan: 'Subdivision Plan',
  site_development_plan: 'Site Development Plan',
  master_plan: 'Master Plan',
  urban_design_plan: 'Urban Design Plan',
  infrastructure_plan: 'Infrastructure Plan',
  landscape_plan: 'Landscape Plan',
  phasing_plan: 'Phasing Plan',
};

export default async function PlansPage() {
  const plans = await getDevelopmentPlans();
  const approved = plans.filter(p => p.status === 'approved' || p.status === 'conditionally_approved');
  const underReview = plans.filter(p => p.status === 'under_review');

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Development Plans</h1>
          <p className="text-slate-600 mt-1">Strategic and area-specific development plans</p>
        </div>
        <Button className="bg-green-600">
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{underReview.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approved.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{plans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Lots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {plans.reduce((sum, p) => sum + (p.proposed_lots || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans List */}
      <Card>
        <CardHeader>
          <CardTitle>All Development Plans</CardTitle>
          <CardDescription>Subdivisions, master plans, and development proposals</CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 mb-4">No development plans found</p>
              <Button className="bg-green-600">
                <Plus className="mr-2 h-4 w-4" />
                Create First Plan
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Plan #
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Plan Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Applicant
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Lots/Units
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
                  {plans.map((plan) => (
                    <tr key={plan.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-slate-900">
                          {plan.plan_number}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-semibold text-slate-900">
                          {plan.plan_name}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">
                          {typeLabels[plan.plan_type] || plan.plan_type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-slate-600">
                            {plan.location || 'Not specified'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-slate-600">
                            {plan.applicant_name || 'Not specified'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-slate-900">
                          {plan.proposed_lots ? `${plan.proposed_lots} lots` :
                           plan.proposed_units ? `${plan.proposed_units} units` : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={statusColors[plan.status]}>
                          {plan.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">
                          {formatDistanceToNow(new Date(plan.submitted_date), { addSuffix: true })}
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
