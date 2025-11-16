'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Camera, CheckCircle, Loader2 } from 'lucide-react';

interface GPSCaptureProps {
  requestId?: string;
  parcelId?: string;
  inspectionId?: string;
  onCapture?: (evidence: any) => void;
}

export function GPSCapture({ requestId, parcelId, inspectionId, onCapture }: GPSCaptureProps) {
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [evidenceType, setEvidenceType] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const captureLocation = () => {
    setCapturing(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setCapturing(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setCapturing(false);
      },
      (error) => {
        setError(`Error capturing location: ${error.message}`);
        setCapturing(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      let photoUrl = null;

      // Upload photo if provided
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `evidence/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('spatial-evidence')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('spatial-evidence')
          .getPublicUrl(fileName);

        photoUrl = urlData.publicUrl;
      }

      // Save spatial evidence
      const evidenceData = {
        request_id: requestId || null,
        parcel_id: parcelId || null,
        inspection_id: inspectionId || null,
        evidence_type: evidenceType,
        description: description || null,
        latitude: location?.latitude,
        longitude: location?.longitude,
        accuracy_meters: location?.accuracy,
        photo_url: photoUrl,
        device_info: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      };

      const { data, error } = await supabase
        .from('spatial_evidence')
        .insert([evidenceData])
        .select()
        .single();

      if (error) throw error;

      setSuccess(true);

      if (onCapture) {
        onCapture(data);
      }

      // Reset form
      setTimeout(() => {
        setLocation(null);
        setEvidenceType('');
        setDescription('');
        setPhoto(null);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save evidence';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          GPS Coordinate Capture
        </CardTitle>
        <CardDescription>
          Capture location and photo evidence for site inspections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Spatial evidence captured successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* GPS Capture */}
          <div className="space-y-3">
            <Label>GPS Location</Label>
            {!location ? (
              <Button
                type="button"
                onClick={captureLocation}
                disabled={capturing}
                className="w-full bg-green-600"
              >
                {capturing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Capturing Location...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Capture Current Location
                  </>
                )}
              </Button>
            ) : (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-green-900">Location Captured</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation(null)}
                  >
                    Clear
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                  <div>
                    <span className="font-medium">Latitude:</span> {location.latitude.toFixed(6)}
                  </div>
                  <div>
                    <span className="font-medium">Longitude:</span> {location.longitude.toFixed(6)}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Accuracy:</span> ±{location.accuracy.toFixed(1)} meters
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 hover:underline"
                >
                  View on Google Maps →
                </a>
              </div>
            )}
          </div>

          {/* Evidence Type */}
          <div className="space-y-2">
            <Label htmlFor="evidence_type">Evidence Type *</Label>
            <Select
              value={evidenceType}
              onValueChange={setEvidenceType}
              disabled={loading}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select evidence type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="site_photo">Site Photo</SelectItem>
                <SelectItem value="gps_coordinate">GPS Coordinate</SelectItem>
                <SelectItem value="boundary_marker">Boundary Marker</SelectItem>
                <SelectItem value="encroachment">Encroachment</SelectItem>
                <SelectItem value="unauthorized_structure">Unauthorized Structure</SelectItem>
                <SelectItem value="compliance_violation">Compliance Violation</SelectItem>
                <SelectItem value="site_condition">Site Condition</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what was observed at this location..."
              disabled={loading}
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="photo">Photo Evidence</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              disabled={loading}
            />
            {photo && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Photo selected: {photo.name}
              </p>
            )}
            <p className="text-xs text-slate-500">
              Capture photo using device camera or select from gallery
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={!location || !evidenceType || loading}
              className="flex-1 bg-green-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Save Evidence
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setLocation(null);
                setEvidenceType('');
                setDescription('');
                setPhoto(null);
              }}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
