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
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewApplicationPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    application_type: '',
    project_title: '',
    project_description: '',
    proposed_use: '',
    estimated_cost: '',
    priority: 'normal',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Generate application number
      const timestamp = Date.now();
      const application_number = `APP-${timestamp}`;

      const { data, error } = await supabase
        .from('development_applications')
        .insert([
          {
            ...formData,
            application_number,
            estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
            status: 'submitted',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      router.push(`/dashboard/applications/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create application');
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/applications">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">New Application</h1>
          <p className="text-slate-600 mt-1">Submit a new development application</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
          <CardDescription>Fill in the required information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Applicant Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="applicant_name">Full Name *</Label>
                  <Input
                    id="applicant_name"
                    required
                    value={formData.applicant_name}
                    onChange={(e) => handleChange('applicant_name', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicant_email">Email</Label>
                  <Input
                    id="applicant_email"
                    type="email"
                    value={formData.applicant_email}
                    onChange={(e) => handleChange('applicant_email', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicant_phone">Phone</Label>
                  <Input
                    id="applicant_phone"
                    type="tel"
                    value={formData.applicant_phone}
                    onChange={(e) => handleChange('applicant_phone', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Project Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="application_type">Application Type *</Label>
                  <Select
                    required
                    value={formData.application_type}
                    onValueChange={(value) => handleChange('application_type', value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="building_permit">Building Permit</SelectItem>
                      <SelectItem value="subdivision">Subdivision</SelectItem>
                      <SelectItem value="change_of_use">Change of Use</SelectItem>
                      <SelectItem value="rezoning">Rezoning</SelectItem>
                      <SelectItem value="site_plan_approval">Site Plan Approval</SelectItem>
                      <SelectItem value="variance">Variance</SelectItem>
                      <SelectItem value="special_permit">Special Permit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleChange('priority', value)}
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
                <Label htmlFor="project_title">Project Title *</Label>
                <Input
                  id="project_title"
                  required
                  value={formData.project_title}
                  onChange={(e) => handleChange('project_title', e.target.value)}
                  disabled={loading}
                  placeholder="e.g., Residential Development - 123 Main Street"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_description">Project Description</Label>
                <Textarea
                  id="project_description"
                  rows={4}
                  value={formData.project_description}
                  onChange={(e) => handleChange('project_description', e.target.value)}
                  disabled={loading}
                  placeholder="Provide a detailed description of the proposed development..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="proposed_use">Proposed Use</Label>
                  <Input
                    id="proposed_use"
                    value={formData.proposed_use}
                    onChange={(e) => handleChange('proposed_use', e.target.value)}
                    disabled={loading}
                    placeholder="e.g., Residential, Commercial, Mixed Use"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_cost">Estimated Cost (USD)</Label>
                  <Input
                    id="estimated_cost"
                    type="number"
                    step="0.01"
                    value={formData.estimated_cost}
                    onChange={(e) => handleChange('estimated_cost', e.target.value)}
                    disabled={loading}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
              <Link href="/dashboard/applications">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
