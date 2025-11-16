'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Under Review', value: 45, color: '#f59e0b' },
  { name: 'Approved', value: 125, color: '#10b981' },
  { name: 'Pending Info', value: 23, color: '#ef4444' },
  { name: 'Submitted', value: 67, color: '#3b82f6' },
  { name: 'Rejected', value: 18, color: '#64748b' },
];

export function StatusDistribution() {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Application Status Distribution</CardTitle>
        <CardDescription>Current status breakdown of all applications</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
