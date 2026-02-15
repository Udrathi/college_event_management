import { User, Event, Registration } from '@/types';

const POSTERS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=600&h=400&fit=crop',
];

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Music', 'Art'];

const VENUES = ['Main Auditorium', 'Seminar Hall A', 'Open Ground', 'Computer Lab', 'Library Hall', 'Sports Complex', 'Conference Room B', 'Amphitheatre'];

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function generateTicketId(): string {
  return 'TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const mockUsers: User[] = [
  { id: 'admin1', name: 'Dr. Priya Sharma', email: 'admin@college.edu', password: 'admin123', role: 'admin' },
  { id: 'admin2', name: 'Prof. Rajesh Kumar', email: 'rajesh@college.edu', password: 'admin123', role: 'admin' },
  { id: 'stu1', name: 'Aarav Patel', email: 'aarav@student.edu', password: 'student123', role: 'student' },
  { id: 'stu2', name: 'Ananya Singh', email: 'ananya@student.edu', password: 'student123', role: 'student' },
  { id: 'stu3', name: 'Rohan Mehta', email: 'rohan@student.edu', password: 'student123', role: 'student' },
  { id: 'stu4', name: 'Sneha Desai', email: 'sneha@student.edu', password: 'student123', role: 'student' },
  { id: 'stu5', name: 'Vikram Joshi', email: 'vikram@student.edu', password: 'student123', role: 'student' },
  { id: 'stu6', name: 'Kavya Nair', email: 'kavya@student.edu', password: 'student123', role: 'student' },
  { id: 'stu7', name: 'Arjun Reddy', email: 'arjun@student.edu', password: 'student123', role: 'student' },
  { id: 'stu8', name: 'Ishita Gupta', email: 'ishita@student.edu', password: 'student123', role: 'student' },
  { id: 'stu9', name: 'Dev Kapoor', email: 'dev@student.edu', password: 'student123', role: 'student' },
  { id: 'stu10', name: 'Meera Iyer', email: 'meera@student.edu', password: 'student123', role: 'student' },
];

const futureDate = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

const pastDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const mockEvents: Event[] = [
  {
    id: 'evt1', title: 'TechFest 2026', date: futureDate(5), time: '10:00',
    venue: VENUES[0], description: 'Annual technology festival with coding competitions, robotics challenges, and tech talks from industry leaders.',
    capacity: 200, category: 'Technical', poster: POSTERS[0], createdBy: 'admin1',
    registrations: ['stu1', 'stu2', 'stu3', 'stu4', 'stu5'], waitlist: [],
  },
  {
    id: 'evt2', title: 'Cultural Night', date: futureDate(10), time: '18:00',
    venue: VENUES[7], description: 'An evening of dance, music, drama, and poetry celebrating diversity and talent.',
    capacity: 150, category: 'Cultural', poster: POSTERS[1], createdBy: 'admin1',
    registrations: ['stu2', 'stu4', 'stu6', 'stu8'], waitlist: [],
  },
  {
    id: 'evt3', title: 'AI/ML Workshop', date: futureDate(3), time: '09:00',
    venue: VENUES[3], description: 'Hands-on workshop on Machine Learning fundamentals with TensorFlow and PyTorch.',
    capacity: 40, category: 'Workshop', poster: POSTERS[2], createdBy: 'admin2',
    registrations: ['stu1', 'stu3', 'stu5', 'stu7', 'stu9'], waitlist: [],
  },
  {
    id: 'evt4', title: 'Inter-College Cricket', date: futureDate(15), time: '07:00',
    venue: VENUES[5], description: 'Annual inter-college cricket tournament. Teams from 8 colleges compete.',
    capacity: 100, category: 'Sports', poster: POSTERS[3], createdBy: 'admin1',
    registrations: ['stu1', 'stu7', 'stu9'], waitlist: [],
  },
  {
    id: 'evt5', title: 'Startup Summit', date: futureDate(20), time: '11:00',
    venue: VENUES[1], description: 'Hear from successful entrepreneurs, pitch your ideas, and network with investors.',
    capacity: 80, category: 'Seminar', poster: POSTERS[4], createdBy: 'admin2',
    registrations: ['stu2', 'stu4'], waitlist: [],
  },
  {
    id: 'evt6', title: 'Hackathon 24hr', date: futureDate(8), time: '09:00',
    venue: VENUES[3], description: '24-hour coding marathon. Build innovative solutions to real-world problems. Prizes worth ₹50,000!',
    capacity: 60, category: 'Hackathon', poster: POSTERS[5], createdBy: 'admin1',
    registrations: ['stu1', 'stu3', 'stu5', 'stu7'], waitlist: [],
  },
  {
    id: 'evt7', title: 'Music Fest', date: futureDate(25), time: '17:00',
    venue: VENUES[7], description: 'Live bands, solo performances, and a battle of bands competition.',
    capacity: 300, category: 'Music', poster: POSTERS[6], createdBy: 'admin2',
    registrations: ['stu2', 'stu6', 'stu8', 'stu10'], waitlist: [],
  },
  {
    id: 'evt8', title: 'Art Exhibition', date: futureDate(12), time: '10:00',
    venue: VENUES[4], description: 'Student artwork showcase including paintings, sculptures, and digital art.',
    capacity: 50, category: 'Art', poster: POSTERS[7], createdBy: 'admin1',
    registrations: ['stu4', 'stu6'], waitlist: [],
  },
  {
    id: 'evt9', title: 'Web Dev Bootcamp', date: pastDate(5), time: '09:00',
    venue: VENUES[3], description: 'Intensive 2-day bootcamp on full-stack web development with React and Node.js.',
    capacity: 35, category: 'Workshop', poster: POSTERS[8], createdBy: 'admin2',
    registrations: ['stu1', 'stu2', 'stu3', 'stu5', 'stu8', 'stu10'], waitlist: [],
  },
  {
    id: 'evt10', title: 'Annual Sports Day', date: pastDate(10), time: '07:00',
    venue: VENUES[5], description: 'Track & field events, team sports, and athletic competitions.',
    capacity: 250, category: 'Sports', poster: POSTERS[9], createdBy: 'admin1',
    registrations: ['stu1', 'stu3', 'stu4', 'stu7', 'stu9', 'stu10'], waitlist: [],
  },
  {
    id: 'evt11', title: 'Cybersecurity Seminar', date: futureDate(30), time: '14:00',
    venue: VENUES[6], description: 'Learn about ethical hacking, network security, and cyber threat prevention.',
    capacity: 45, category: 'Seminar', poster: POSTERS[0], createdBy: 'admin2',
    registrations: ['stu5', 'stu9'], waitlist: [],
  },
  {
    id: 'evt12', title: 'Dance Competition', date: futureDate(18), time: '16:00',
    venue: VENUES[0], description: 'Solo and group dance competition across classical, contemporary, and freestyle categories.',
    capacity: 120, category: 'Cultural', poster: POSTERS[1], createdBy: 'admin1',
    registrations: ['stu2', 'stu4', 'stu6', 'stu8', 'stu10'], waitlist: [],
  },
];

export const mockRegistrations: Registration[] = [];

// Generate registrations from mock events
mockEvents.forEach(event => {
  event.registrations.forEach(userId => {
    mockRegistrations.push({
      id: generateId(),
      userId,
      eventId: event.id,
      ticketId: generateTicketId(),
      registeredAt: new Date().toISOString(),
      attended: new Date(event.date) < new Date(),
    });
  });
});

export function initializeData() {
  if (!localStorage.getItem('ems_users')) {
    localStorage.setItem('ems_users', JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem('ems_events')) {
    localStorage.setItem('ems_events', JSON.stringify(mockEvents));
  }
  if (!localStorage.getItem('ems_registrations')) {
    localStorage.setItem('ems_registrations', JSON.stringify(mockRegistrations));
  }
}

export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem('ems_users') || '[]');
}

export function getEvents(): Event[] {
  return JSON.parse(localStorage.getItem('ems_events') || '[]');
}

export function setEvents(events: Event[]) {
  localStorage.setItem('ems_events', JSON.stringify(events));
}

export function getRegistrations(): Registration[] {
  return JSON.parse(localStorage.getItem('ems_registrations') || '[]');
}

export function setRegistrations(regs: Registration[]) {
  localStorage.setItem('ems_registrations', JSON.stringify(regs));
}

export function registerForEvent(userId: string, eventId: string): { success: boolean; ticketId?: string; waitlisted?: boolean; message: string } {
  const events = getEvents();
  const regs = getRegistrations();
  const event = events.find(e => e.id === eventId);
  if (!event) return { success: false, message: 'Event not found' };

  if (event.registrations.includes(userId)) return { success: false, message: 'Already registered' };
  if (event.waitlist.includes(userId)) return { success: false, message: 'Already on waitlist' };

  if (event.registrations.length >= event.capacity) {
    event.waitlist.push(userId);
    setEvents(events);
    return { success: true, waitlisted: true, message: 'Added to waitlist' };
  }

  const ticketId = generateTicketId();
  event.registrations.push(userId);
  setEvents(events);
  regs.push({
    id: generateId(),
    userId,
    eventId,
    ticketId,
    registeredAt: new Date().toISOString(),
    attended: false,
  });
  setRegistrations(regs);
  return { success: true, ticketId, message: 'Registered successfully!' };
}

export function unregisterFromEvent(userId: string, eventId: string): boolean {
  const events = getEvents();
  const regs = getRegistrations();
  const event = events.find(e => e.id === eventId);
  if (!event) return false;

  event.registrations = event.registrations.filter(id => id !== userId);
  event.waitlist = event.waitlist.filter(id => id !== userId);

  // Promote from waitlist
  if (event.waitlist.length > 0 && event.registrations.length < event.capacity) {
    const promoted = event.waitlist.shift()!;
    event.registrations.push(promoted);
    const ticketId = generateTicketId();
    regs.push({
      id: generateId(),
      userId: promoted,
      eventId,
      ticketId,
      registeredAt: new Date().toISOString(),
      attended: false,
    });
  }

  setEvents(events);
  const filtered = regs.filter(r => !(r.userId === userId && r.eventId === eventId));
  setRegistrations(filtered);
  return true;
}
