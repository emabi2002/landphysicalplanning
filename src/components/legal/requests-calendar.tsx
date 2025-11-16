'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import Link from 'next/link';

interface LegalRequest {
  id: string;
  request_number: string;
  subject: string;
  status: string;
  urgency: string;
  due_date?: string;
  is_overdue: boolean;
  days_remaining?: number;
}

interface RequestsCalendarProps {
  requests: LegalRequest[];
}

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-500',
  received: 'bg-cyan-500',
  assigned: 'bg-purple-500',
  in_progress: 'bg-amber-500',
  pending_information: 'bg-orange-500',
  under_review: 'bg-indigo-500',
  completed: 'bg-green-500',
  returned_to_legal: 'bg-teal-500',
  closed: 'bg-slate-500',
};

const urgencyColors: Record<string, string> = {
  low: 'border-slate-300',
  normal: 'border-blue-400',
  high: 'border-orange-400',
  urgent: 'border-red-500',
};

export function RequestsCalendar({ requests }: RequestsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Get requests for selected date
  const requestsOnDate = requests.filter((req) => {
    if (!req.due_date) return false;
    return isSameDay(new Date(req.due_date), selectedDate);
  });

  // Get all dates with requests in current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Adjust to start from Sunday
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());

  // Adjust to end on Saturday
  const calendarEnd = new Date(monthEnd);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - calendarEnd.getDay()));

  // Count requests by date
  const requestCountByDate = requests.reduce((acc, req) => {
    if (!req.due_date) return acc;
    const dateKey = format(new Date(req.due_date), 'yyyy-MM-dd');
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar View */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-green-600" />
              Legal Requests Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Custom Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-slate-600 py-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {eachDayOfInterval({ start: calendarStart, end: calendarEnd }).map((day, idx) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const requestCount = requestCountByDate[dateKey] || 0;
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                const hasRequests = requestCount > 0;
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

                // Check if any request on this day is overdue
                const hasOverdue = requests.some(
                  (req) => req.due_date && isSameDay(new Date(req.due_date), day) && req.is_overdue
                );

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative aspect-square p-2 rounded-lg text-sm transition-all
                      ${!isCurrentMonth ? 'text-slate-300' : ''}
                      ${isSelected ? 'bg-green-600 text-white shadow-lg scale-105' : ''}
                      ${!isSelected && isToday ? 'bg-blue-50 border-2 border-blue-500' : ''}
                      ${!isSelected && !isToday && hasRequests ? 'bg-slate-50 hover:bg-slate-100' : ''}
                      ${!isSelected && !isToday && !hasRequests ? 'hover:bg-slate-50' : ''}
                    `}
                  >
                    <span className={isSelected ? 'font-bold' : ''}>{format(day, 'd')}</span>
                    {hasRequests && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        <span
                          className={`
                            inline-block w-1.5 h-1.5 rounded-full
                            ${hasOverdue ? 'bg-red-500' : isSelected ? 'bg-white' : 'bg-green-600'}
                          `}
                        />
                        {requestCount > 1 && (
                          <span className={`text-[10px] ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                            {requestCount}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-slate-600 pt-4 border-t">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-50 border-2 border-blue-500" />
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-600" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                <span>Has Requests</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Overdue</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests for Selected Date */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </CardTitle>
          <p className="text-sm text-slate-600">
            {requestsOnDate.length} {requestsOnDate.length === 1 ? 'request' : 'requests'} due
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {requestsOnDate.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm text-slate-500">No requests due on this date</p>
              </div>
            ) : (
              requestsOnDate.map((request) => (
                <Link
                  key={request.id}
                  href={`/dashboard/legal-requests/${request.id}`}
                  className={`
                    block p-3 rounded-lg border-l-4 hover:shadow-md transition-shadow
                    ${urgencyColors[request.urgency]}
                    ${request.is_overdue ? 'bg-red-50' : 'bg-white'}
                  `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-600">
                          {request.request_number}
                        </span>
                        {request.is_overdue && (
                          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 text-[10px]">
                            OVERDUE
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-900 line-clamp-2">
                        {request.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`w-2 h-2 rounded-full ${statusColors[request.status]}`} />
                        <span className="text-xs text-slate-600 capitalize">
                          {request.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`
                        text-[10px] shrink-0
                        ${request.urgency === 'urgent' ? 'bg-red-100 text-red-700 border-red-300' : ''}
                        ${request.urgency === 'high' ? 'bg-orange-100 text-orange-700 border-orange-300' : ''}
                        ${request.urgency === 'normal' ? 'bg-blue-100 text-blue-700 border-blue-300' : ''}
                        ${request.urgency === 'low' ? 'bg-slate-100 text-slate-700 border-slate-300' : ''}
                      `}
                    >
                      {request.urgency}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
