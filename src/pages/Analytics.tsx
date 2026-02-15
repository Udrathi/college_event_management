import { useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { getEvents } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['hsl(230, 65%, 28%)', 'hsl(38, 92%, 50%)', 'hsl(142, 71%, 45%)', 'hsl(262, 60%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(200, 70%, 50%)', 'hsl(320, 60%, 50%)', 'hsl(160, 60%, 40%)'];

export default function Analytics() {
  const events = getEvents();

  const participantsData = useMemo(() => {
    return events
      .sort((a, b) => b.registrations.length - a.registrations.length)
      .slice(0, 8)
      .map(e => ({
        name: e.title.length > 15 ? e.title.substring(0, 15) + '…' : e.title,
        participants: e.registrations.length,
        capacity: e.capacity,
      }));
  }, [events]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    events.forEach(e => { map[e.category] = (map[e.category] || 0) + e.registrations.length; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [events]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground mb-8">Event performance and insights</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Participants per Event</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={participantsData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--card-foreground))' }} />
                  <Bar dataKey="participants" fill="hsl(230, 65%, 28%)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="capacity" fill="hsl(38, 92%, 50%)" radius={[6, 6, 0, 0]} opacity={0.4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Category Popularity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={120} innerRadius={60} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--card-foreground))' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
