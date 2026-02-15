import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { getEvents, getRegistrations, registerForEvent, unregisterFromEvent } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { QRTicket } from '@/components/QRTicket';
import { Calendar, Clock, MapPin, Users, ArrowLeft, CalendarPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [, setRefresh] = useState(0);

  const events = getEvents();
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Event not found</h1>
          <Button onClick={() => navigate('/events')} className="mt-4">Back to Events</Button>
        </div>
      </Layout>
    );
  }

  const isPast = new Date(event.date) < new Date();
  const isRegistered = user ? event.registrations.includes(user.id) : false;
  const isWaitlisted = user ? event.waitlist.includes(user.id) : false;
  const isFull = event.registrations.length >= event.capacity;

  const registration = user ? getRegistrations().find(r => r.userId === user.id && r.eventId === event.id) : null;

  const handleRegister = () => {
    if (!user) { navigate('/login'); return; }
    const result = registerForEvent(user.id, event.id);
    toast({
      title: result.success ? '🎉 Success' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
    setRefresh(r => r + 1);
  };

  const handleUnregister = () => {
    if (!user) return;
    unregisterFromEvent(user.id, event.id);
    toast({ title: 'Unregistered', description: 'You have been removed from this event.' });
    setRefresh(r => r + 1);
  };

  const generateCalendarUrl = () => {
    const start = new Date(`${event.date}T${event.time}`);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace('.000', '');
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${fmt(start)}/${fmt(end)}&location=${encodeURIComponent(event.venue)}&details=${encodeURIComponent(event.description)}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80">
              <img src={event.poster} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-accent text-accent-foreground mb-2">{event.category}</Badge>
                <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">{event.title}</h1>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-lg text-card-foreground mb-3">About this Event</h2>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Calendar, label: 'Date', value: new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                { icon: Clock, label: 'Time', value: event.time },
                { icon: MapPin, label: 'Venue', value: event.venue },
                { icon: Users, label: 'Capacity', value: `${event.registrations.length}/${event.capacity}` },
              ].map(item => (
                <Card key={item.label}>
                  <CardContent className="p-4 text-center">
                    <item.icon className="h-5 w-5 text-accent mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-semibold text-sm text-card-foreground">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4 animate-slide-in">
            {!isPast && user?.role === 'student' && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  {isRegistered ? (
                    <>
                      <Badge className="bg-success text-success-foreground">✓ Registered</Badge>
                      <Button variant="destructive" className="w-full" onClick={handleUnregister}>Unregister</Button>
                    </>
                  ) : isWaitlisted ? (
                    <>
                      <Badge className="bg-warning text-warning-foreground">On Waitlist</Badge>
                      <Button variant="destructive" className="w-full" onClick={handleUnregister}>Leave Waitlist</Button>
                    </>
                  ) : (
                    <Button className="w-full gradient-accent text-accent-foreground" onClick={handleRegister}>
                      {isFull ? 'Join Waitlist' : 'Register Now'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {!isPast && (
              <Button variant="outline" className="w-full gap-2" onClick={() => window.open(generateCalendarUrl(), '_blank')}>
                <CalendarPlus className="h-4 w-4" /> Add to Calendar
              </Button>
            )}

            {isRegistered && registration && user && (
              <QRTicket registration={registration} event={event} user={user} />
            )}

            {isPast && <Badge variant="secondary" className="w-full justify-center py-2">This event has ended</Badge>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
