'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ResponseFormProps {
  requestId: string;
  currentStatus: string;
  responseSummary?: string;
  findings?: string;
  recommendations?: string;
}

export function ResponseForm({
  requestId,
  currentStatus,
  responseSummary: existingResponse,
  findings: existingFindings,
  recommendations: existingRecommendations,
}: ResponseFormProps) {
  const [responseSummary, setResponseSummary] = useState(existingResponse || '');
  const [findings, setFindings] = useState(existingFindings || '');
  const [recommendations, setRecommendations] = useState(existingRecommendations || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Update request with response
      const { error: updateError } = await supabase
        .from('legal_planning_requests')
        .update({
          response_summary: responseSummary,
          findings: findings || null,
          recommendations: recommendations || null,
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Add activity log
      await supabase.from('legal_request_activity').insert([
        {
          request_id: requestId,
          activity_type: 'response_sent',
          comment: 'Response submitted to Legal Division',
        },
      ]);

      setSuccess(true);

      // Refresh page
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit response';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = currentStatus === 'completed' || currentStatus === 'returned_to_legal' || currentStatus === 'closed';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response to Legal Division</CardTitle>
        <CardDescription>
          {isReadOnly
            ? 'Response has been submitted'
            : 'Provide findings and recommendations'}
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
              <AlertDescription className="text-green-800">
                Response submitted successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="response_summary">Response Summary *</Label>
            <Textarea
              id="response_summary"
              rows={4}
              value={responseSummary}
              onChange={(e) => setResponseSummary(e.target.value)}
              placeholder="Provide a concise summary of the response to Legal Division..."
              required
              disabled={loading || isReadOnly}
            />
            <p className="text-xs text-slate-500">
              This will be the main response sent to the Legal Division
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="findings">Detailed Findings</Label>
            <Textarea
              id="findings"
              rows={6}
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              placeholder="Detailed findings from Physical Planning investigation or review..."
              disabled={loading || isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendations">Recommendations</Label>
            <Textarea
              id="recommendations"
              rows={4}
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Any recommendations for Legal Division or future actions..."
              disabled={loading || isReadOnly}
            />
          </div>

          {!isReadOnly && (
            <>
              <div className="pt-4 border-t border-slate-200">
                <Label>Attach Supporting Documents</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="file"
                    multiple
                    disabled={loading}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <Button type="button" variant="outline" size="icon" disabled={loading}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Attach reports, photos, GIS plots, or other evidence
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={!responseSummary.trim() || loading}
                  className="bg-green-600"
                >
                  {loading ? 'Submitting...' : 'Submit Response'}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" disabled={loading}>
                  Save Draft
                </Button>
              </div>
            </>
          )}

          {isReadOnly && (
            <div className="pt-4">
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  This response has been submitted and is read-only.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
