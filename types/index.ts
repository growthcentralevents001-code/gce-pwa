export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'member' | 'venue' | 'franchisee' | 'enterprise_client' | 'admin';
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  price: number;
  capacity: number;
  registered: number;
  vertical: 'Connect' | 'Marketplace' | 'Enterprise';
  status: 'draft' | 'pending_approval' | 'live' | 'cancelled' | 'completed';
  image_url?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  event_id: string;
  user_id: string;
  total_amount: number;
  status: 'booked' | 'attended' | 'cancelled' | 'refunded';
  created_at: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  tier: 'Basic' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  status: 'active' | 'pending' | 'inactive';
  monthly_fee: number;
}
