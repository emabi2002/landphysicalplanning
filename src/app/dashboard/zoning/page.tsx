import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { Plus, Map } from 'lucide-react';

async function getZoningDistricts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('zoning_districts')
    .select('*')
    .order('code', { ascending: true });

  if (error) {
    console.error('Error fetching zoning districts:', error);
    return [];
  }

  return data || [];
}

export default async function ZoningPage() {
  const districts = await getZoningDistricts();

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Zoning Districts</h1>
          <p className="text-slate-600 mt-1">Manage zoning classifications and regulations</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Zoning District
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Zoning Districts</CardTitle>
        </CardHeader>
        <CardContent>
          {districts.length === 0 ? (
            <div className="text-center py-12">
              <Map className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 mb-4">No zoning districts defined yet</p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create First District
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {districts.map((district) => (
                <Card key={district.id} className="border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{district.code}</CardTitle>
                      {district.color && (
                        <div
                          className="w-6 h-6 rounded border border-slate-300"
                          style={{ backgroundColor: district.color }}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-slate-900 mb-2">{district.name}</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      {district.description || 'No description available'}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
