export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  capacity: number;
  category: string;
  poster: string;
  createdBy: string;
  registrations: string[]; // user IDs
  waitlist: string[];
  price?: number;
  isPaid?: boolean;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  ticketId: string;
  registeredAt: string;
  attended: boolean;
}

export interface Feedback {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  comment: string;
}
