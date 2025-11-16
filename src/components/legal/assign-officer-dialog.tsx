'use client';

import { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Officer {
  id: string;
  full_name: string;
  email: string;
  department: string;
}

interface AssignOfficerDialogProps {
  requestId: string;
  currentStatus: string;
}

export function AssignOfficerDialog({ requestId, currentStatus }: AssignOfficerDialogProps) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchOfficers();
    }
  }, [open]);

  const fetchOfficers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, department')
        .eq('role', 'user')
        .order('full_name');

      if (error) throw error;
      setOfficers(data || []);
    } catch (err) {
      console.error('Error fetching officers:', err);
      setError('Failed to load officers');
    }
  };

  const handleAssign = async () => {
    if (!selectedOfficer) {
      setError('Please select an officer');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update request
      const { error: updateError } = await supabase
        .from('legal_planning_requests')
        .update({
          assigned_to: selectedOfficer,
          assigned_at: new Date().toISOString(),
          status: currentStatus === 'submitted' || currentStatus === 'received' ? 'assigned' : currentStatus,
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Log activity
      await supabase.from('legal_request_activity').insert([
        {
          request_id: requestId,
          activity_type: 'assigned',
          new_value: selectedOfficer,
          comment: 'Request assigned to planning officer',
        },
      ]);

      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error('Error assigning officer:', err);
      setError('Failed to assign officer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full bg-green-600">
          <UserPlus className="h-4 w-4 mr-2" />
          Assign Officer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Planning Officer</DialogTitle>
          <DialogDescription>
            Select an officer to handle this legal request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Planning Officer</Label>
            <Select value={selectedOfficer} onValueChange={setSelectedOfficer} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select an officer" />
              </SelectTrigger>
              <SelectContent>
                {officers.map((officer) => (
                  <SelectItem key={officer.id} value={officer.id}>
                    {officer.full_name} - {officer.department || 'Physical Planning'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={loading || !selectedOfficer}>
              {loading ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
