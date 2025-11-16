'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface WorkflowProps {
  requestId: string;
  currentStatus: string;
}

const workflowSteps = [
  { status: 'submitted', label: 'Submitted', description: 'Request received from Legal Division' },
  { status: 'received', label: 'Received', description: 'Acknowledged by Physical Planning' },
  { status: 'assigned', label: 'Assigned', description: 'Officer assigned to handle request' },
  { status: 'in_progress', label: 'In Progress', description: 'Officer working on the request' },
  { status: 'under_review', label: 'Under Review', description: 'Response being reviewed' },
  { status: 'completed', label: 'Completed', description: 'Response ready' },
  { status: 'returned_to_legal', label: 'Returned to Legal', description: 'Sent back to Legal Division' },
];

const nextStatusOptions: Record<string, string[]> = {
  submitted: ['received'],
  received: ['assigned'],
  assigned: ['in_progress'],
  in_progress: ['under_review', 'pending_information'],
  pending_information: ['in_progress'],
  under_review: ['completed', 'in_progress'],
  completed: ['returned_to_legal'],
  returned_to_legal: ['closed'],
};

export function RequestWorkflow({ requestId, currentStatus }: WorkflowProps) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Update status
      const { error: updateError } = await supabase
        .from('legal_planning_requests')
        .update({
          status: selectedStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Add activity log
      await supabase.from('legal_request_activity').insert([
        {
          request_id: requestId,
          activity_type: 'status_changed',
          old_value: currentStatus,
          new_value: selectedStatus,
          comment: comment || null,
        },
      ]);

      setSuccess(true);
      setComment('');
      setSelectedStatus('');

      // Refresh page
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const availableStatuses = nextStatusOptions[currentStatus] || [];
  const currentStepIndex = workflowSteps.findIndex(step => step.status === currentStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Status</CardTitle>
        <CardDescription>Track and update the request progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Workflow Visualization */}
        <div className="space-y-3">
          {workflowSteps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = step.status === currentStatus;
            const isPending = index > currentStepIndex;

            return (
              <div key={step.status} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : isCurrent ? (
                    <div className="h-5 w-5 rounded-full border-2 border-green-600 bg-green-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isCurrent ? 'text-green-700' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p
                    className={`text-xs ${
                      isCurrent ? 'text-green-600' : isCompleted ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Update Form */}
        {availableStatuses.length > 0 && (
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Update Status</h4>

              {error && (
                <Alert variant="destructive" className="mb-3">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-3 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    Status updated successfully!
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <div>
                  <Label htmlFor="status">Next Status</Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select next status" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStatuses.map((status) => {
                        const step = workflowSteps.find(s => s.status === status);
                        return (
                          <SelectItem key={status} value={status}>
                            {step?.label || status}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="comment">Comment (Optional)</Label>
                  <Textarea
                    id="comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add notes about this status change..."
                    disabled={loading}
                  />
                </div>

                <Button
                  onClick={handleStatusUpdate}
                  disabled={!selectedStatus || loading}
                  className="w-full bg-green-600"
                >
                  {loading ? 'Updating...' : 'Update Status'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
