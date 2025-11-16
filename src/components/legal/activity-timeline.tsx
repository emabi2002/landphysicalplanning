import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import {
  FileText,
  CheckCircle,
  UserPlus,
  MessageSquare,
  Upload,
  Send,
  Clock,
  AlertCircle,
  Circle
} from 'lucide-react';

interface Activity {
  id: string;
  activity_type: string;
  old_value?: string;
  new_value?: string;
  comment?: string;
  created_at: string;
  users?: {
    full_name: string;
    email: string;
  };
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const activityIcons: Record<string, any> = {
  created: FileText,
  received: CheckCircle,
  assigned: UserPlus,
  status_changed: Circle,
  comment_added: MessageSquare,
  document_uploaded: Upload,
  response_sent: Send,
  deadline_extended: Clock,
  escalated: AlertCircle,
  completed: CheckCircle,
  reopened: FileText,
};

const activityColors: Record<string, string> = {
  created: 'text-blue-600 bg-blue-100',
  received: 'text-green-600 bg-green-100',
  assigned: 'text-purple-600 bg-purple-100',
  status_changed: 'text-amber-600 bg-amber-100',
  comment_added: 'text-slate-600 bg-slate-100',
  document_uploaded: 'text-indigo-600 bg-indigo-100',
  response_sent: 'text-green-600 bg-green-100',
  deadline_extended: 'text-orange-600 bg-orange-100',
  escalated: 'text-red-600 bg-red-100',
  completed: 'text-green-600 bg-green-100',
  reopened: 'text-amber-600 bg-amber-100',
};

const activityLabels: Record<string, string> = {
  created: 'Created',
  received: 'Received',
  assigned: 'Assigned',
  status_changed: 'Status Changed',
  comment_added: 'Comment Added',
  document_uploaded: 'Document Uploaded',
  response_sent: 'Response Sent',
  deadline_extended: 'Deadline Extended',
  escalated: 'Escalated',
  completed: 'Completed',
  reopened: 'Reopened',
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>Complete audit trail of all actions</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Circle className="h-12 w-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activityIcons[activity.activity_type] || Circle;
              const colorClass = activityColors[activity.activity_type] || 'text-slate-600 bg-slate-100';
              const label = activityLabels[activity.activity_type] || activity.activity_type;

              return (
                <div key={activity.id} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {index < activities.length - 1 && (
                      <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{label}</p>
                        {activity.users && (
                          <p className="text-xs text-slate-500">{activity.users.full_name}</p>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>

                    {/* Status change details */}
                    {activity.activity_type === 'status_changed' && activity.old_value && activity.new_value && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                        <Badge variant="outline" className="bg-slate-50">
                          {activity.old_value.replace('_', ' ')}
                        </Badge>
                        <span>→</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {activity.new_value.replace('_', ' ')}
                        </Badge>
                      </div>
                    )}

                    {/* Comment */}
                    {activity.comment && (
                      <p className="text-sm text-slate-700 mt-2 bg-slate-50 p-2 rounded border border-slate-200">
                        {activity.comment}
                      </p>
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-slate-400 mt-2">
                      {format(new Date(activity.created_at), 'PPpp')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
