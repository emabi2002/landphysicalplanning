'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeleteRequestDialogProps {
  requestId: string;
  requestNumber: string;
  redirectAfterDelete?: boolean;
}

export function DeleteRequestDialog({ requestId, requestNumber, redirectAfterDelete = false }: DeleteRequestDialogProps) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      // Soft delete - set status to closed
      const { error: updateError } = await supabase
        .from('legal_planning_requests')
        .update({
          status: 'closed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Log activity
      await supabase.from('legal_request_activity').insert([
        {
          request_id: requestId,
          activity_type: 'status_changed',
          new_value: 'closed',
          comment: 'Request closed/withdrawn',
        },
      ]);

      setOpen(false);

      if (redirectAfterDelete) {
        router.push('/dashboard/legal-requests');
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error('Error deleting request:', err);
      setError('Failed to withdraw request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4 mr-2" />
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Withdraw Request
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to withdraw request <strong>{requestNumber}</strong>?
            This will close the request and mark it as withdrawn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertDescription>
              This action can be reversed by changing the status back to an active state.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Withdrawing...' : 'Withdraw Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
