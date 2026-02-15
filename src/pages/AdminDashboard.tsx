import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/StatsCard';
import { useAuth } from '@/contexts/AuthContext';
import { getEvents, getRegistrations, setEvents } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Users, TrendingUp, Plus, Pencil, Trash2, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types';

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Music', 'Art'];

const POSTERS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
];

interface EventFormData {
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  capacity: string;
  category: string;
  poster: string;
}

const emptyForm: EventFormData = { title: '', date: '', time: '', venue: '', description: '', capacity: '', category: 'Technical', poster: POSTERS[0] };

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<EventFormData>(emptyForm);
  const [, setRefresh] = useState(0);

  const events = getEvents();
  const regs = getRegistrations();

  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = events.filter(e => new Date(e.date) >= now);
    const totalRegs = events.reduce((sum, e) => sum + e.registrations.length, 0);
    return { total: events.length, upcoming: upcoming.length, totalRegs, avg: events.length ? Math.round(totalRegs / events.length) : 0 };
  }, [events]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (event: Event) => {
    setEditingEvent(event);
    setForm({
      title: event.title, date: event.date, time: event.time, venue: event.venue,
      description: event.description, capacity: String(event.capacity), category: event.category, poster: event.poster,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allEvents = getEvents();

    if (editingEvent) {
      const idx = allEvents.findIndex(ev => ev.id === editingEvent.id);
      if (idx >= 0) {
        allEvents[idx] = { ...allEvents[idx], ...form, capacity: Number(form.capacity) };
        setEvents(allEvents);
        toast({ title: 'Updated', description: 'Event updated successfully.' });
      }
    } else {
      const newEvent: Event = {
        id: 'evt_' + Math.random().toString(36).substring(2, 9),
        ...form,
        capacity: Number(form.capacity),
        createdBy: user?.id || '',
        registrations: [],
        waitlist: [],
      };
      allEvents.push(newEvent);
      setEvents(allEvents);
      toast({ title: '🎉 Created', description: 'Event created successfully.' });
    }

    setDialogOpen(false);
    setRefresh(r => r + 1);
  };

  const handleDelete = (eventId: string) => {
    const allEvents = getEvents().filter(e => e.id !== eventId);
    setEvents(allEvents);
    toast({ title: 'Deleted', description: 'Event removed.' });
    setRefresh(r => r + 1);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/analytics')} variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" /> Analytics
            </Button>
            <Button onClick={handleOpenCreate} className="gradient-accent text-accent-foreground gap-2">
              <Plus className="h-4 w-4" /> Create Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Events" value={stats.total} icon={CalendarDays} />
          <StatsCard title="Upcoming" value={stats.upcoming} icon={TrendingUp} />
          <StatsCard title="Total Registrations" value={stats.totalRegs} icon={Users} />
          <StatsCard title="Avg. per Event" value={stats.avg} icon={BarChart3} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Event</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">Date</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden md:table-cell">Category</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Registrations</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <img src={event.poster} alt="" className="w-10 h-10 rounded-lg object-cover hidden sm:block" />
                          <span className="font-medium text-card-foreground">{event.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                      <td className="py-3 px-2 hidden md:table-cell"><Badge variant="secondary">{event.category}</Badge></td>
                      <td className="py-3 px-2 text-card-foreground">{event.registrations.length}/{event.capacity}</td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(event)}><Pencil className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Venue</Label>
                <Input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input type="number" min="1" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Poster URL</Label>
                <Input value={form.poster} onChange={e => setForm({ ...form, poster: e.target.value })} placeholder="Image URL" />
                <div className="flex gap-2 flex-wrap">
                  {POSTERS.map(p => (
                    <img key={p} src={p} alt="" className={`w-14 h-10 rounded cursor-pointer object-cover border-2 ${form.poster === p ? 'border-accent' : 'border-transparent'}`} onClick={() => setForm({ ...form, poster: p })} />
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
