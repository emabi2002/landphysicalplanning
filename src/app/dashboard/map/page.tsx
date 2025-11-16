'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Layers, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Dynamically import map to avoid SSR issues
const MapViewer = dynamic(
  () => import('@/components/gis/map-viewer').then((mod) => mod.MapViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px] bg-slate-100 rounded">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

interface SelectedParcel {
  id: string;
  parcel_number: string;
  address: string;
  area_sqm?: number;
  owner_name?: string;
  status: string;
}

export default function GISMapPage() {
  const [selectedParcel, setSelectedParcel] = useState<SelectedParcel | null>(null);
  const [showZoning, setShowZoning] = useState(true);
  const [showParcels, setShowParcels] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleParcelClick = (parcel: any) => {
    setSelectedParcel(parcel);
  };

  const statusColors: Record<string, string> = {
    registered: 'bg-green-100 text-green-800 border-green-200',
    disputed: 'bg-red-100 text-red-800 border-red-200',
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Map className="h-8 w-8 text-green-600" />
            GIS Mapping System
          </h1>
          <p className="text-slate-600 mt-1">
            Interactive spatial planning and parcel management
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Add Location
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
            <Layers className="h-4 w-4 mr-2" />
            Manage Layers
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Interactive Map</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={showZoning ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowZoning(!showZoning)}
                    className={showZoning ? "bg-green-600" : ""}
                  >
                    <Layers className="h-3 w-3 mr-1" />
                    Zoning
                  </Button>
                  <Button
                    variant={showParcels ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowParcels(!showParcels)}
                    className={showParcels ? "bg-green-600" : ""}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Parcels
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <MapViewer
                center={[-9.4438, 147.1803]} // Port Moresby
                zoom={13}
                selectedParcelId={selectedParcel?.id}
                onParcelClick={handleParcelClick}
                showZoning={showZoning}
                showParcels={showParcels}
                height="600px"
              />
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Search */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Parcel number or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button size="icon" className="bg-green-600">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Selected Parcel Details */}
          {selectedParcel ? (
            <Card className="border-green-200">
              <CardHeader className="pb-3 bg-green-50">
                <CardTitle className="text-base text-green-900">
                  Parcel Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Parcel Number</p>
                  <p className="font-semibold text-sm">{selectedParcel.parcel_number}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Address</p>
                  <p className="text-sm">{selectedParcel.address}</p>
                </div>

                {selectedParcel.area_sqm && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Area</p>
                    <p className="text-sm font-medium">
                      {selectedParcel.area_sqm.toLocaleString()} sqm
                    </p>
                  </div>
                )}

                {selectedParcel.owner_name && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Owner</p>
                    <p className="text-sm">{selectedParcel.owner_name}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <Badge variant="outline" className={statusColors[selectedParcel.status]}>
                    {selectedParcel.status}
                  </Badge>
                </div>

                <div className="pt-2 space-y-2">
                  <Button className="w-full bg-green-600" size="sm">
                    View Full Details
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="text-center text-slate-400 py-8">
                  <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Click on a parcel to view details</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Map Statistics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Map Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Parcels</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Zoning Districts</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Mapped Area</span>
                <span className="font-semibold">0 sqkm</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              Add Parcel
            </Button>
            <Button variant="outline" className="justify-start">
              <Layers className="h-4 w-4 mr-2" />
              Define Zoning
            </Button>
            <Button variant="outline" className="justify-start">
              <Map className="h-4 w-4 mr-2" />
              Export Map
            </Button>
            <Button variant="outline" className="justify-start">
              <Search className="h-4 w-4 mr-2" />
              Advanced Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
