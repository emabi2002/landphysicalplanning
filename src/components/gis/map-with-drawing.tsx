'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Square, Edit, Trash2, Save } from 'lucide-react';

interface DrawnShape {
  type: string;
  coordinates: number[][][] | number[];
  properties: Record<string, any>;
}

interface MapWithDrawingProps {
  center?: LatLngExpression;
  zoom?: number;
  onShapeSaved?: (shape: DrawnShape) => void;
  height?: string;
}

export function MapWithDrawing({
  center = [-9.4438, 147.1803],
  zoom = 13,
  onShapeSaved,
  height = '600px',
}: MapWithDrawingProps) {
  const [drawnShapes, setDrawnShapes] = useState<DrawnShape[]>([]);
  const [selectedShape, setSelectedShape] = useState<DrawnShape | null>(null);
  const [shapeName, setShapeName] = useState('');
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  const handleCreated = (e: any) => {
    const { layer, layerType } = e;

    let coordinates;
    if (layerType === 'polygon') {
      coordinates = layer.getLatLngs()[0].map((latlng: L.LatLng) => [
        latlng.lng,
        latlng.lat,
      ]);
      // Close the polygon
      coordinates.push(coordinates[0]);
    } else if (layerType === 'marker') {
      const latlng = layer.getLatLng();
      coordinates = [latlng.lng, latlng.lat];
    }

    const shape: DrawnShape = {
      type: layerType,
      coordinates,
      properties: {
        name: shapeName || `Shape ${drawnShapes.length + 1}`,
        created_at: new Date().toISOString(),
      },
    };

    setDrawnShapes(prev => [...prev, shape]);
    setSelectedShape(shape);
  };

  const handleEdited = (e: any) => {
    // Handle edited shapes
    console.log('Shapes edited:', e);
  };

  const handleDeleted = (e: any) => {
    // Handle deleted shapes
    console.log('Shapes deleted:', e);
  };

  const saveShape = () => {
    if (selectedShape && onShapeSaved) {
      onShapeSaved(selectedShape);
      setShapeName('');
      setSelectedShape(null);
    }
  };

  const calculateArea = (coordinates: number[][][]) => {
    // Simple area calculation for polygon
    if (!coordinates || coordinates.length === 0) return 0;

    const points = coordinates[0];
    let area = 0;

    for (let i = 0; i < points.length - 1; i++) {
      area += points[i][0] * points[i + 1][1] - points[i + 1][0] * points[i][1];
    }

    area = Math.abs(area / 2);

    // Convert to approximate square meters (rough calculation)
    const sqMeters = area * 111319.9 * 111319.9;
    return Math.round(sqMeters);
  };

  return (
    <div className="space-y-4">
      {/* Drawing Tools Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Square className="h-4 w-4 text-blue-600" />
          <h4 className="text-sm font-semibold text-blue-900">Drawing Tools Active</h4>
        </div>
        <p className="text-xs text-blue-700">
          Use the tools on the left side of the map to draw parcels, boundaries, or add markers.
          Click "Save Shape" after drawing to save to database.
        </p>
      </Card>

      {/* Map */}
      <div style={{ height }} className="relative border border-slate-200 rounded-lg overflow-hidden">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topleft"
              onCreated={handleCreated}
              onEdited={handleEdited}
              onDeleted={handleDeleted}
              draw={{
                rectangle: true,
                polygon: {
                  allowIntersection: false,
                  showArea: true,
                  metric: true,
                },
                polyline: true,
                circle: false,
                circlemarker: false,
                marker: true,
              }}
              edit={{
                edit: false,
                remove: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>

      {/* Shape Details Panel */}
      {selectedShape && (
        <Card className="p-4 border-green-200">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Shape Created</h4>
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="shapeName">Name/Label *</Label>
                  <Input
                    id="shapeName"
                    value={shapeName}
                    onChange={(e) => setShapeName(e.target.value)}
                    placeholder="e.g., Parcel PM-2024-001, Zone R1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Type</p>
                    <p className="font-medium capitalize">{selectedShape.type}</p>
                  </div>
                  {selectedShape.type === 'polygon' && Array.isArray(selectedShape.coordinates[0]) && (
                    <div>
                      <p className="text-slate-500">Area (approx)</p>
                      <p className="font-medium">
                        {calculateArea(selectedShape.coordinates as number[][][]).toLocaleString()} sqm
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">GeoJSON Coordinates</p>
                  <pre className="text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto max-h-32">
                    {JSON.stringify(selectedShape.coordinates, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={saveShape}
                disabled={!shapeName}
                className="flex-1 bg-green-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Shape
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedShape(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Drawn Shapes List */}
      {drawnShapes.length > 0 && (
        <Card className="p-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">
            Drawn Shapes ({drawnShapes.length})
          </h4>
          <div className="space-y-2">
            {drawnShapes.map((shape, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{shape.properties.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{shape.type}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
