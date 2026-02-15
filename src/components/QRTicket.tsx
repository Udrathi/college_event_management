import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Ticket } from 'lucide-react';
import { Registration, Event, User } from '@/types';

interface QRTicketProps {
  registration: Registration;
  event: Event;
  user: User;
}

export function QRTicket({ registration, event, user }: QRTicketProps) {
  const ticketData = JSON.stringify({
    ticketId: registration.ticketId,
    eventId: event.id,
    eventTitle: event.title,
    userName: user.name,
    date: event.date,
  });

  const handleDownload = () => {
    const svg = document.getElementById(`qr-${registration.ticketId}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#1a2356';
    ctx.fillRect(0, 0, 800, 500);

    // Header band
    ctx.fillStyle = '#e5a00d';
    ctx.fillRect(0, 0, 800, 8);
    ctx.fillRect(0, 492, 800, 8);

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillText('🎓 CampusEvents', 30, 60);

    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText(event.title, 30, 120);

    ctx.font = '16px Inter, sans-serif';
    ctx.fillStyle = '#b0b8d0';
    ctx.fillText(`Attendee: ${user.name}`, 30, 165);
    ctx.fillText(`Date: ${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`, 30, 195);
    ctx.fillText(`Time: ${event.time}`, 30, 225);
    ctx.fillText(`Venue: ${event.venue}`, 30, 255);

    ctx.fillStyle = '#e5a00d';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`Ticket: ${registration.ticketId}`, 30, 310);

    // QR Code
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(530, 90, 240, 240);
      ctx.drawImage(img, 540, 100, 220, 220);

      const link = document.createElement('a');
      link.download = `ticket-${registration.ticketId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Card className="overflow-hidden border-2 border-accent/30">
      <div className="gradient-primary p-4">
        <div className="flex items-center gap-2 text-primary-foreground">
          <Ticket className="h-5 w-5" />
          <span className="font-bold">Event Ticket</span>
        </div>
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="bg-card p-3 rounded-lg border">
            <QRCodeSVG
              id={`qr-${registration.ticketId}`}
              value={ticketData}
              size={140}
              level="H"
              includeMargin
              fgColor="hsl(230, 65%, 28%)"
            />
          </div>
          <div className="flex-1 space-y-1 text-sm">
            <h4 className="font-bold text-card-foreground">{event.title}</h4>
            <p className="text-muted-foreground">{user.name}</p>
            <p className="text-muted-foreground">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {event.time}</p>
            <p className="text-muted-foreground">{event.venue}</p>
            <p className="font-mono text-xs text-accent font-bold mt-2">{registration.ticketId}</p>
          </div>
        </div>
        <Button onClick={handleDownload} className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
          <Download className="h-4 w-4" />
          Download Ticket
        </Button>
      </CardContent>
    </Card>
  );
}
