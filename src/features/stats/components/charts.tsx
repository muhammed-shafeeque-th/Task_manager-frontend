import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS } from '@/features/tasks/constants';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/features/tasks/types';
import { ChartPanel } from './ChartPanel';
import { useStatsStore } from '../store';

const AXIS_TICK = { fill: '#5b6773', fontSize: 12 };
const GRID = '#e6e9e3';

export function StatusChart() {
  const stats = useStatsStore((s) => s.stats);
  const data = stats
    ? TASK_STATUSES.map((s) => ({ name: STATUS_LABELS[s], value: stats.byStatus[s], fill: STATUS_COLORS[s] }))
    : [];
  const visible = data.filter((d) => d.value > 0);

  return (
    <ChartPanel
      title="Tasks by status"
      summary={data.map((d) => `${d.name}: ${d.value}`).join(', ')}
      empty={!stats || stats.total === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={visible} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2} stroke="none" />
          <Tooltip />
          <Legend verticalAlign="bottom" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

export function PriorityChart() {
  const stats = useStatsStore((s) => s.stats);
  const data = stats
    ? TASK_PRIORITIES.map((p) => ({ name: PRIORITY_LABELS[p], count: stats.byPriority[p], fill: PRIORITY_COLORS[p] }))
    : [];

  return (
    <ChartPanel
      title="Tasks by priority"
      summary={data.map((d) => `${d.name}: ${d.count}`).join(', ')}
      empty={!stats || stats.total === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="name" tick={AXIS_TICK} tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Bar dataKey="count" name="Tasks" radius={[4, 4, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

const weekday = (isoDay: string) => new Date(`${isoDay}T12:00:00Z`).toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' });

export function CompletionTrendChart() {
  const stats = useStatsStore((s) => s.stats);
  const data = stats?.completedLast7Days.map((d) => ({ ...d, label: weekday(d.date) })) ?? [];
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <ChartPanel
      title="Completed in the last 7 days"
      summary={`${total} tasks completed. ${data.map((d) => `${d.label}: ${d.count}`).join(', ')}`}
      empty={!stats}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" name="Completed" stroke="#1d5c4e" strokeWidth={2.5} dot={{ r: 3, fill: '#1d5c4e' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
