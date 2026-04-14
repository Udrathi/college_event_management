import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isPast = new Date(event.date) < new Date();
  const isFull = event.registrations.length >= event.capacity;

  // ✅ ADDED: check if event is paid
  const isPaid = event.isPaid && event.price && event.price > 0;

  return (
    <Link to={`/events/${event.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.poster}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-accent text-accent-foreground">{event.category}</Badge>
            {isPast && <Badge variant="secondary">Completed</Badge>}
            {isFull && !isPast && <Badge variant="destructive">Full</Badge>}
          </div>

          {/* ✅ ADDED: Paid badge in top-right corner */}
          {isPaid && !isPast && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-indigo-600 text-white flex items-center gap-1">
                <IndianRupee className="h-3 w-3" />
                {event.price}
              </Badge>
            </div>
          )}

          {/* ✅ ADDED: Free badge in top-right for free events */}
          {!isPaid && !isPast && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-600 text-white">
                Free
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-lg text-card-foreground line-clamp-1">{event.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-accent" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-accent" />
              <span>{event.registrations.length}/{event.capacity}</span>
            </div>
          </div>

          {/* ✅ ADDED: Bottom CTA strip */}
          <div className={`text-xs font-medium text-center py-1.5 rounded-md ${
            isPast
              ? 'bg-muted text-muted-foreground'
              : isFull
              ? 'bg-red-50 text-red-600'
              : isPaid
              ? 'bg-indigo-50 text-indigo-700'
              : 'bg-green-50 text-green-700'
          }`}>
            {isPast
              ? 'Event Completed'
              : isFull
              ? 'No Seats Available'
              : isPaid
              ? `Click to Register • ₹${event.price}`
              : 'Click to Register • Free'}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}