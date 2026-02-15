import { useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { getEvents, getRegistrations } from '@/data/mockData';
import { StatsCard } from '@/components/StatsCard';
import { QRTicket } from '@/components/QRTicket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Ticket, History, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';

export default function StudentDashboard() {
  const { user } = useAuth();

  const { registered, past, upcoming, registrations } = useMemo(() => {
    const events = getEvents();
    const regs = getRegistrations();
    const now = new Date();

    const userRegs = regs.filter(r => r.userId === user?.id);
    const regEventIds = userRegs.map(r => r.eventId);
    const regEvents = events.filter(e => regEventIds.includes(e.id));

    return {
      registered: regEvents,
      past: regEvents.filter(e => new Date(e.date) < now),
      upcoming: regEvents.filter(e => new Date(e.date) >= now),
      registrations: userRegs,
    };
  }, [user]);

  const generateCertificate = (eventTitle: string, userName: string, date: string) => {
    const doc = new jsPDF({ orientation: 'landscape' });

    // Border
    doc.setDrawColor(26, 35, 86);
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);
    doc.setDrawColor(229, 160, 13);
    doc.setLineWidth(1);
    doc.rect(15, 15, 267, 180);

    // Title
    doc.setFontSize(36);
    doc.setTextColor(26, 35, 86);
    doc.text('Certificate of Participation', 148.5, 55, { align: 'center' });

    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('This certifies that', 148.5, 80, { align: 'center' });

    // Name
    doc.setFontSize(28);
    doc.setTextColor(229, 160, 13);
    doc.text(userName, 148.5, 100, { align: 'center' });

    // Event info
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('has successfully participated in', 148.5, 118, { align: 'center' });

    doc.setFontSize(20);
    doc.setTextColor(26, 35, 86);
    doc.text(eventTitle, 148.5, 135, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 148.5, 155, { align: 'center' });

    // Footer
    doc.setFontSize(10);
    doc.text('CampusEvents - College Event Management System', 148.5, 180, { align: 'center' });

    doc.save(`certificate-${eventTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatsCard title="Registered Events" value={registered.length} icon={Ticket} />
          <StatsCard title="Upcoming" value={upcoming.length} icon={CalendarDays} />
          <StatsCard title="Attended" value={past.length} icon={History} />
        </div>

        {upcoming.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Your Tickets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map(event => {
                const reg = registrations.find(r => r.eventId === event.id);
                if (!reg) return null;
                return (
                  <div key={event.id} className="animate-fade-in">
                    <QRTicket registration={reg} event={event} user={user} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-accent" />
              Event History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {registered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No registered events yet.</p>
                <Link to="/events" className="text-accent hover:underline text-sm">Browse Events</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {registered.map(event => {
                  const isPastEvent = new Date(event.date) < new Date();
                  return (
                    <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <img src={event.poster} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <Link to={`/events/${event.id}`} className="font-medium text-card-foreground hover:text-accent truncate block">{event.title}</Link>
                        <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {event.venue}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={isPastEvent ? 'secondary' : 'default'} className={!isPastEvent ? 'bg-success text-success-foreground' : ''}>
                          {isPastEvent ? 'Completed' : 'Upcoming'}
                        </Badge>
                        {isPastEvent && (
                          <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => generateCertificate(event.title, user.name, event.date)}>
                            <Star className="h-3 w-3" /> Certificate
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
