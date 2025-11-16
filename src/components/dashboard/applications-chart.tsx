'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { month: 'Jan', submitted: 45, approved: 32, rejected: 8 },
  { month: 'Feb', submitted: 52, approved: 38, rejected: 10 },
  { month: 'Mar', submitted: 48, approved: 35, rejected: 9 },
  { month: 'Apr', submitted: 61, approved: 42, rejected: 12 },
  { month: 'May', submitted: 55, approved: 40, rejected: 11 },
  { month: 'Jun', submitted: 67, approved: 48, rejected: 13 },
];

export function ApplicationsChart() {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Application Trends</CardTitle>
        <CardDescription>Monthly application statistics for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="submitted"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Submitted"
            />
            <Line
              type="monotone"
              dataKey="approved"
              stroke="#10b981"
              strokeWidth={2}
              name="Approved"
            />
            <Line
              type="monotone"
              dataKey="rejected"
              stroke="#ef4444"
              strokeWidth={2}
              name="Rejected"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
