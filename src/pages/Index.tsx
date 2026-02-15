import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getEvents } from '@/data/mockData';
import { EventCard } from '@/components/EventCard';
import { GraduationCap, ArrowRight, CalendarDays, Users, Award } from 'lucide-react';
import { useMemo } from 'react';

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const featuredEvents = useMemo(() => {
    return getEvents()
      .filter(e => new Date(e.date) >= new Date())
      .sort((a, b) => b.registrations.length - a.registrations.length)
      .slice(0, 3);
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-semibold">College Event Management</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Discover Campus <span className="text-gradient">Events</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-lg mx-auto">
              Register for workshops, hackathons, cultural fests and more. Get your QR tickets instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated ? (
                <Button size="lg" className="gradient-accent text-accent-foreground gap-2" onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/student')}>
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button size="lg" className="gradient-accent text-accent-foreground gap-2" onClick={() => navigate('/signup')}>
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate('/login')}>
                    Login
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
            {[
              { icon: CalendarDays, value: '12+', label: 'Events' },
              { icon: Users, value: '150+', label: 'Participants' },
              { icon: Award, value: '8', label: 'Categories' },
            ].map(stat => (
              <div key={stat.label} className="animate-fade-in">
                <stat.icon className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Trending Events</h2>
                <p className="text-muted-foreground">Most popular upcoming events</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/events')} className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event, i) => (
                <div key={event.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
