import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { Plus, MapPin } from 'lucide-react';
import Link from 'next/link';

async function getAllParcels() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('land_parcels')
    .select('*, zoning_districts(name, code)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching parcels:', error);
    return [];
  }

  return data || [];
}

const statusColors: Record<string, string> = {
  registered: 'bg-green-100 text-green-800 border-green-200',
  disputed: 'bg-red-100 text-red-800 border-red-200',
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
};

export default async function ParcelsPage() {
  const parcels = await getAllParcels();

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Land Parcels</h1>
          <p className="text-slate-600 mt-1">Manage land parcels and property records</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Parcel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Land Parcels</CardTitle>
        </CardHeader>
        <CardContent>
          {parcels.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 mb-4">No land parcels registered yet</p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Register First Parcel
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Parcel Number
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Address
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Owner
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Area (sqm)
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Zoning
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parcels.map((parcel: any) => (
                    <tr key={parcel.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-slate-900">
                          {parcel.parcel_number}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-900">{parcel.address}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">{parcel.owner_name || '-'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">
                          {parcel.area_sqm ? parcel.area_sqm.toLocaleString() : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">
                          {parcel.zoning_districts?.code || '-'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={statusColors[parcel.status]}>
                          {parcel.status}
                        </Badge>
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
