'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Upload, X, FileText } from 'lucide-react';
import Link from 'next/link';

export default function NewLegalRequestPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    // Legal Division Info
    legal_case_number: '',
    legal_officer_name: '',
    legal_officer_email: '',
    legal_officer_phone: '',
    legal_division_ref: '',

    // Request Details
    request_type: '',
    subject: '',
    description: '',
    urgency: 'normal',

    // Related Records
    parcel_id: '',
    application_id: '',

    // SLA
    sla_days: '10',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Generate request number
      const timestamp = Date.now();
      const request_number = `LR-${timestamp}`;

      // Calculate due date
      const due_date = new Date();
      due_date.setDate(due_date.getDate() + parseInt(formData.sla_days));

      // Create request
      const { data: request, error: requestError } = await supabase
        .from('legal_planning_requests')
        .insert([
          {
            request_number,
            legal_case_number: formData.legal_case_number || null,
            legal_officer_name: formData.legal_officer_name,
            legal_officer_email: formData.legal_officer_email || null,
            legal_officer_phone: formData.legal_officer_phone || null,
            legal_division_ref: formData.legal_division_ref || null,
            request_type: formData.request_type,
            subject: formData.subject,
            description: formData.description || null,
            urgency: formData.urgency,
            parcel_id: formData.parcel_id || null,
            application_id: formData.application_id || null,
            sla_days: parseInt(formData.sla_days),
            due_date: due_date.toISOString(),
            status: 'submitted',
          },
        ])
        .select()
        .single();

      if (requestError) throw requestError;

      // Upload documents if any
      if (uploadedFiles.length > 0 && request) {
        for (const file of uploadedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${request.id}/${Date.now()}.${fileExt}`;

          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('legal-documents')
            .upload(fileName, file);

          if (uploadError) {
            console.error('File upload error:', uploadError);
            continue;
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('legal-documents')
            .getPublicUrl(fileName);

          // Save document record
          await supabase.from('legal_request_documents').insert([
            {
              request_id: request.id,
              document_type: 'legal_request_letter',
              file_name: file.name,
              file_url: urlData.publicUrl,
              file_size: file.size,
              direction: 'from_legal',
            },
          ]);
        }
      }

      router.push(`/dashboard/legal-requests/${request.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create request';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/legal-requests">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">New Legal Request</h1>
          <p className="text-slate-600 mt-1">Submit a request from Legal Division</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Legal Division Information */}
        <Card>
          <CardHeader>
            <CardTitle>Legal Division Information</CardTitle>
            <CardDescription>Details from the Legal Case Management System</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="legal_case_number">Legal Case Number</Label>
                <Input
                  id="legal_case_number"
                  value={formData.legal_case_number}
                  onChange={(e) => handleChange('legal_case_number', e.target.value)}
                  placeholder="e.g., LC-2024-001"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legal_division_ref">Legal Division Reference</Label>
                <Input
                  id="legal_division_ref"
                  value={formData.legal_division_ref}
                  onChange={(e) => handleChange('legal_division_ref', e.target.value)}
                  placeholder="Internal reference"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="legal_officer_name">Legal Officer Name *</Label>
                <Input
                  id="legal_officer_name"
                  required
                  value={formData.legal_officer_name}
                  onChange={(e) => handleChange('legal_officer_name', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legal_officer_email">Email</Label>
                <Input
                  id="legal_officer_email"
                  type="email"
                  value={formData.legal_officer_email}
                  onChange={(e) => handleChange('legal_officer_email', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legal_officer_phone">Phone</Label>
                <Input
                  id="legal_officer_phone"
                  type="tel"
                  value={formData.legal_officer_phone}
                  onChange={(e) => handleChange('legal_officer_phone', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>What information is needed from Physical Planning?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="request_type">Request Type *</Label>
                <Select
                  required
                  value={formData.request_type}
                  onValueChange={(value) => handleChange('request_type', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zoning_confirmation">Zoning Confirmation</SelectItem>
                    <SelectItem value="zoning_change_verification">Zoning Change Verification</SelectItem>
                    <SelectItem value="development_approval_verification">Development Approval Verification</SelectItem>
                    <SelectItem value="compliance_investigation_request">Compliance Investigation</SelectItem>
                    <SelectItem value="unauthorized_development_report">Unauthorized Development Report</SelectItem>
                    <SelectItem value="parcel_history_request">Parcel History Request</SelectItem>
                    <SelectItem value="inspection_findings_request">Inspection Findings</SelectItem>
                    <SelectItem value="spatial_evidence_request">Spatial Evidence Request</SelectItem>
                    <SelectItem value="boundary_dispute_assessment">Boundary Dispute Assessment</SelectItem>
                    <SelectItem value="planning_opinion">Planning Opinion</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency *</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(value) => handleChange('urgency', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                required
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                placeholder="Brief description of the request"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Provide detailed information about what is needed from Physical Planning Division..."
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sla_days">Response Deadline (Days) *</Label>
              <Input
                id="sla_days"
                type="number"
                min="1"
                max="90"
                required
                value={formData.sla_days}
                onChange={(e) => handleChange('sla_days', e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-slate-500">Standard is 10 days. Urgent cases may require fewer days.</p>
            </div>
          </CardContent>
        </Card>

        {/* Related Records */}
        <Card>
          <CardHeader>
            <CardTitle>Related Records (Optional)</CardTitle>
            <CardDescription>Link to relevant parcels or applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="parcel_id">Land Parcel ID</Label>
                <Input
                  id="parcel_id"
                  value={formData.parcel_id}
                  onChange={(e) => handleChange('parcel_id', e.target.value)}
                  placeholder="UUID of the parcel"
                  disabled={loading}
                />
                <p className="text-xs text-slate-500">If related to a specific parcel</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="application_id">Application ID</Label>
                <Input
                  id="application_id"
                  value={formData.application_id}
                  onChange={(e) => handleChange('application_id', e.target.value)}
                  placeholder="UUID of the application"
                  disabled={loading}
                />
                <p className="text-xs text-slate-500">If related to a development application</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Attach Documents</CardTitle>
            <CardDescription>Upload supporting documents (court orders, letters, etc.)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documents">Upload Files</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="documents"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  disabled={loading}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Button type="button" variant="outline" size="icon" disabled={loading}>
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Accepted: PDF, DOC, DOCX, JPG, PNG. Max 10MB per file.
              </p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Files ({uploadedFiles.length})</Label>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-emerald-600"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
          <Link href="/dashboard/legal-requests">
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
