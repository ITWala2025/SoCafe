export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          display_order?: number;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          category_slug: string;
          name: string;
          description: string;
          price: string | null;
          is_available: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_slug: string;
          name: string;
          description: string;
          price?: string | null;
          is_available?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_slug?: string;
          name?: string;
          description?: string;
          price?: string | null;
          is_available?: boolean;
          display_order?: number;
          created_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          booking_type: 'table' | 'event';
          event_type: string | null;
          event_location: string | null;
          catering_package: string | null;
          guests: string;
          reservation_date: string;
          reservation_time: string;
          notes: string | null;
          status: 'pending' | 'confirmed' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          booking_type?: 'table' | 'event';
          event_type?: string | null;
          event_location?: string | null;
          catering_package?: string | null;
          guests: string;
          reservation_date: string;
          reservation_time: string;
          notes?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          booking_type?: 'table' | 'event';
          event_type?: string | null;
          event_location?: string | null;
          catering_package?: string | null;
          guests?: string;
          reservation_date?: string;
          reservation_time?: string;
          notes?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled';
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type MenuItem = Database['public']['Tables']['menu_items']['Row'];
export type NewMenuItem = Database['public']['Tables']['menu_items']['Insert'];
export type Reservation = Database['public']['Tables']['reservations']['Row'];
export type NewReservation = Database['public']['Tables']['reservations']['Insert'];
