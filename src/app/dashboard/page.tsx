import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import {
  FileText,
  Clock,
  CheckCircle,
  MapPin,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { ApplicationsChart } from '@/components/dashboard/applications-chart';
import { StatusDistribution } from '@/components/dashboard/status-distribution';
import { RecentApplications } from '@/components/dashboard/recent-applications';

async function getDashboardStats() {
  const supabase = await createClient();

  try {
    // Get total applications
    const { count: totalApplications } = await supabase
      .from('development_applications')
      .select('*', { count: 'exact', head: true });

    // Get pending applications
    const { count: pendingApplications } = await supabase
      .from('development_applications')
      .select('*', { count: 'exact', head: true })
      .in('status', ['submitted', 'under_review']);

    // Get approved this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: approvedThisMonth } = await supabase
      .from('development_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .gte('decision_date', startOfMonth.toISOString());

    // Get under review
    const { count: underReview } = await supabase
      .from('development_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'under_review');

    // Get total parcels
    const { count: totalParcels } = await supabase
      .from('land_parcels')
      .select('*', { count: 'exact', head: true });

    // Get pending info applications
    const { count: pendingInfo } = await supabase
      .from('development_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending_info');

    return {
      totalApplications: totalApplications || 0,
      pendingApplications: pendingApplications || 0,
      approvedThisMonth: approvedThisMonth || 0,
      underReview: underReview || 0,
      totalParcels: totalParcels || 0,
      pendingInfo: pendingInfo || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalApplications: 0,
      pendingApplications: 0,
      approvedThisMonth: 0,
      underReview: 0,
      totalParcels: 0,
      pendingInfo: 0,
    };
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      description: 'All time applications',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Under Review',
      value: stats.underReview,
      icon: Clock,
      description: 'Currently being reviewed',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Approved This Month',
      value: stats.approvedThisMonth,
      icon: CheckCircle,
      description: 'Applications approved',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Land Parcels',
      value: stats.totalParcels,
      icon: MapPin,
      description: 'Registered parcels',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Info',
      value: stats.pendingInfo,
      icon: AlertCircle,
      description: 'Awaiting information',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Pending Action',
      value: stats.pendingApplications,
      icon: TrendingUp,
      description: 'Requires attention',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Development Mode Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-900">Development Mode Active</h3>
            <p className="text-xs text-amber-700 mt-0.5">
              Authentication is bypassed. All features accessible without login.
              <span className="font-medium"> Do not deploy to production in this mode.</span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Physical Planning Division - Overview & Analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ApplicationsChart />
        <StatusDistribution />
      </div>

      {/* Recent Applications */}
      <RecentApplications />
    </div>
  );
}
