'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import type { GeoJSONProps } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { createClient } from '@/lib/supabase/client';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ParcelData {
  id: string;
  parcel_number: string;
  address: string;
  area_sqm?: number;
  owner_name?: string;
  zoning_district_id?: string;
  geojson?: any;
  status: string;
}

interface ZoningData {
  id: string;
  name: string;
  code: string;
  color?: string;
  geojson?: any;
}

interface MapViewerProps {
  center?: LatLngExpression;
  zoom?: number;
  selectedParcelId?: string;
  onParcelClick?: (parcel: ParcelData) => void;
  showZoning?: boolean;
  showParcels?: boolean;
  height?: string;
}

export function MapViewer({
  center = [-9.4438, 147.1803], // Port Moresby, PNG
  zoom = 13,
  selectedParcelId,
  onParcelClick,
  showZoning = true,
  showParcels = true,
  height = '600px',
}: MapViewerProps) {
  const [parcels, setParcels] = useState<ParcelData[]>([]);
  const [zoningDistricts, setZoningDistricts] = useState<ZoningData[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadMapData();

    // Subscribe to realtime updates
    const parcelsChannel = supabase
      .channel('parcels-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'land_parcels' }, () => {
        loadMapData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(parcelsChannel);
    };
  }, []);

  const loadMapData = async () => {
    try {
      setLoading(true);

      // Load parcels with coordinates
      if (showParcels) {
        const { data: parcelsData, error: parcelsError } = await supabase
          .from('land_parcels')
          .select('*')
          .not('geojson', 'is', null);

        if (!parcelsError && parcelsData) {
          setParcels(parcelsData);
        }
      }

      // Load zoning districts
      if (showZoning) {
        const { data: zoningData, error: zoningError } = await supabase
          .from('zoning_districts')
          .select('*')
          .not('geojson', 'is', null);

        if (!zoningError && zoningData) {
          setZoningDistricts(zoningData);
        }
      }
    } catch (error) {
      console.error('Error loading map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getZoningStyle = (district: ZoningData) => {
    return {
      fillColor: district.color || '#3b82f6',
      weight: 2,
      opacity: 1,
      color: district.color || '#3b82f6',
      fillOpacity: 0.3
    };
  };

  const getParcelStyle = (parcel: ParcelData) => {
    const isSelected = parcel.id === selectedParcelId;
    const baseColor = parcel.status === 'disputed' ? '#ef4444' : '#10b981';

    return {
      fillColor: baseColor,
      weight: isSelected ? 3 : 2,
      opacity: 1,
      color: isSelected ? '#1e40af' : baseColor,
      fillOpacity: isSelected ? 0.5 : 0.2
    };
  };

  const onParcelFeatureClick = (feature: any, layer: any, parcel: ParcelData) => {
    layer.on({
      click: () => {
        if (onParcelClick) {
          onParcelClick(parcel);
        }
      },
      mouseover: () => {
        layer.setStyle({
          fillOpacity: 0.5,
          weight: 3
        });
      },
      mouseout: () => {
        layer.setStyle(getParcelStyle(parcel));
      }
    });

    // Bind popup
    const popupContent = `
      <div class="p-2">
        <h3 class="font-bold text-sm mb-1">${parcel.parcel_number}</h3>
        <p class="text-xs text-gray-600">${parcel.address}</p>
        ${parcel.area_sqm ? `<p class="text-xs mt-1">Area: ${parcel.area_sqm.toLocaleString()} sqm</p>` : ''}
        ${parcel.owner_name ? `<p class="text-xs">Owner: ${parcel.owner_name}</p>` : ''}
        <p class="text-xs mt-1"><span class="font-semibold">Status:</span> ${parcel.status}</p>
      </div>
    `;
    layer.bindPopup(popupContent);
  };

  return (
    <div className="relative" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 bg-white/80 z-[1000] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map data...</p>
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        {/* Base Map Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Satellite Layer Alternative (Uncomment to use) */}
        {/* <TileLayer
          attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url="https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=YOUR_MAPBOX_TOKEN"
        /> */}

        {/* Zoning Districts Layer */}
        {showZoning && zoningDistricts.map((district) => (
          district.geojson && (
            <GeoJSON
              key={`zoning-${district.id}`}
              data={district.geojson}
              style={() => getZoningStyle(district)}
              onEachFeature={(feature, layer) => {
                layer.bindPopup(`
                  <div class="p-2">
                    <h3 class="font-bold text-sm">${district.code}</h3>
                    <p class="text-xs text-gray-600">${district.name}</p>
                  </div>
                `);
              }}
            />
          )
        ))}

        {/* Land Parcels Layer */}
        {showParcels && parcels.map((parcel) => (
          parcel.geojson && (
            <GeoJSON
              key={`parcel-${parcel.id}`}
              data={parcel.geojson}
              style={() => getParcelStyle(parcel)}
              onEachFeature={(feature, layer) => onParcelFeatureClick(feature, layer, parcel)}
            />
          )
        ))}

        {/* Zoom Control */}
        <ZoomControl position="topright" />

        {/* Map Legend */}
        <MapLegend showZoning={showZoning} showParcels={showParcels} />
      </MapContainer>
    </div>
  );
}

// Map Legend Component
function MapLegend({ showZoning, showParcels }: { showZoning: boolean; showParcels: boolean }) {
  const map = useMap();

  useEffect(() => {
    const legend = new L.Control({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'bg-white p-3 rounded shadow-lg border border-gray-200');

      let html = '<h4 class="font-bold text-xs mb-2">Map Legend</h4>';

      if (showParcels) {
        html += `
          <div class="text-xs space-y-1">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-green-600" style="background-color: rgba(16, 185, 129, 0.2)"></div>
              <span>Registered Parcel</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-red-600" style="background-color: rgba(239, 68, 68, 0.2)"></div>
              <span>Disputed Parcel</span>
            </div>
          </div>
        `;
      }

      if (showZoning) {
        html += `
          <div class="text-xs mt-2 pt-2 border-t border-gray-200">
            <p class="font-semibold mb-1">Zoning Districts</p>
            <p class="text-gray-500 text-xs">Colored by district</p>
          </div>
        `;
      }

      div.innerHTML = html;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map, showZoning, showParcels]);

  return null;
}
