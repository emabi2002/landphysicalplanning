'use client';

import { AssignOfficerDialog } from './assign-officer-dialog';
import { DeleteRequestDialog } from './delete-request-dialog';

interface RequestActionsProps {
  requestId: string;
  requestNumber: string;
  currentStatus: string;
  hasAssignedUser: boolean;
}

export function RequestActions({ requestId, requestNumber, currentStatus, hasAssignedUser }: RequestActionsProps) {
  return (
    <div className="flex gap-2">
      <DeleteRequestDialog
        requestId={requestId}
        requestNumber={requestNumber}
        redirectAfterDelete={true}
      />
    </div>
  );
}

interface AssignmentCardProps {
  requestId: string;
  currentStatus: string;
  assignedUser?: {
    full_name: string;
    email: string;
    department?: string;
  };
  assignedAt?: string;
}

export function AssignmentCard({ requestId, currentStatus, assignedUser, assignedAt }: AssignmentCardProps) {
  if (assignedUser) {
    return (
      <div>
        <p className="text-sm font-medium text-slate-900">
          {assignedUser.full_name}
        </p>
        <p className="text-xs text-slate-500">{assignedUser.email}</p>
        {assignedUser.department && (
          <p className="text-xs text-slate-500 mt-1">{assignedUser.department}</p>
        )}
        {assignedAt && (
          <p className="text-xs text-slate-500 mt-2">
            Assigned {new Date(assignedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-slate-500 mb-2">Not assigned yet</p>
      <AssignOfficerDialog requestId={requestId} currentStatus={currentStatus} />
    </div>
  );
}
