import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { EventCard } from '@/components/EventCard';
import { getEvents } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Music', 'Art'];

export default function Events() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showPast, setShowPast] = useState(false);

  const events = useMemo(() => {
    let list = getEvents();
    const now = new Date();

    if (!showPast) list = list.filter(e => new Date(e.date) >= now);
    else list = list.filter(e => new Date(e.date) < now);

    if (category !== 'All') list = list.filter(e => e.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
    }

    return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [search, category, showPast]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{showPast ? 'Past Events' : 'Upcoming Events'}</h1>
          <p className="text-muted-foreground">Discover and register for exciting campus events</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search events..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPast(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!showPast ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setShowPast(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showPast ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
            >
              Past
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <Badge
              key={cat}
              className={`cursor-pointer transition-colors ${category === cat ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No events found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <div key={event.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
