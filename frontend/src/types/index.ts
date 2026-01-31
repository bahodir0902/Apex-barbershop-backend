// User types
export interface User {
  id: string;
  email: string;
  phone_number: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'client' | 'barber' | 'owner' | 'admin';
  privacy: 'private' | 'public';
  profile_picture: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email_or_phone: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email_or_phone: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

// Barbershop types
export interface Barbershop {
  id: string;
  owner: User;
  name: string;
  address: string;
  phone_number: string | null;
  picture: string | null;
  description: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  average_rating: number;
  total_barbers: number;
  barbers?: Barber[];
  haircuts?: Haircut[];
  created_at: string;
  updated_at: string;
}

export interface Barber {
  id: string;
  user: User | null;
  barbershop: Barbershop;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string | null;
  email: string | null;
  picture: string | null;
  experienced_years: number;
  bio: string;
  working_start_time: string;
  working_end_time: string;
  break_start_time: string;
  break_end_time: string;
  working_days: string;
  is_active: boolean;
  average_rating: number;
  total_appointments: number;
  haircuts?: Haircut[];
  created_at: string;
  updated_at: string;
}

export interface Haircut {
  id: string;
  barbershop: Barbershop;
  name: string;
  description: string;
  price: string;
  picture: string | null;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Appointment types
export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  barbershop: Barbershop;
  barber: Barber;
  customer: User;
  haircut: Haircut;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: AppointmentStatus;
  is_active: boolean;
  is_finished: boolean;
  customer_notes: string;
  total_price: string;
  feedback?: Feedback;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentRequest {
  barbershop_id: string;
  barber_id: string;
  haircut_id: string;
  appointment_date: string;
  appointment_time: string;
  customer_notes?: string;
  idempotency_key?: string;
}

// Feedback types
export interface Feedback {
  id: string;
  appointment: Appointment;
  barber: Barber;
  customer: User;
  rating: string;
  comment: string;
  barber_response: string;
  response_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateFeedbackRequest {
  appointment_id: string;
  rating: number;
  comment?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Available slots
export interface AvailableSlot {
  date: string;
  barber: Barber;
  available_slots: string[];
}

export interface AvailableDay {
  date: string;
  day: string;
}

export interface AvailableDaysResponse {
  barber: Barber;
  available_days: AvailableDay[];
}
