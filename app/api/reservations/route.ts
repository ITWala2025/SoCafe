import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { NewReservation, Reservation } from '@/types/supabase';

// In-memory mock store for dev fallback
let mockReservations: Reservation[] = [
  {
    id: 'res-101',
    name: 'Sarah O’Connor',
    email: 'sarah.oc@example.ie',
    phone: '+353 87 234 5678',
    booking_type: 'table',
    event_type: null,
    catering_package: null,
    guests: '3-4',
    reservation_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    reservation_time: '10:30',
    notes: 'Book club meeting — quiet table by window if possible.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'res-102',
    name: 'Michael Byrne',
    email: 'm.byrne@dublin.ie',
    phone: '+353 85 999 1234',
    booking_type: 'event',
    event_type: 'Lucan Community Committee Debrief',
    catering_package: 'Coffee & Morning Pastries',
    guests: '16-30',
    reservation_date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    reservation_time: '11:30',
    notes: 'Community room hire with projector and coffee service.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'res-103',
    name: 'Aoife Higgins',
    email: 'aoife.higgins@gmail.com',
    phone: '+353 86 444 8822',
    booking_type: 'table',
    event_type: null,
    catering_package: null,
    guests: '1-2',
    reservation_date: new Date().toISOString().split('T')[0],
    reservation_time: '14:30',
    notes: 'Study session with laptop.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
];

// GET: List all reservations (Admin)
export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return NextResponse.json({
          source: 'supabase',
          data,
        });
      }
    }

    // Fallback in-memory list
    return NextResponse.json({
      source: 'mock',
      data: mockReservations,
    });
  } catch (error) {
    console.error('Failed to get reservations:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve reservations' },
      { status: 500 }
    );
  }
}

// POST: Create a new reservation (Guest or Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      guests,
      reservation_date,
      reservation_time,
      notes,
      booking_type,
      event_type,
      catering_package,
    } = body;

    if (!name || !email || !reservation_date || !reservation_time) {
      return NextResponse.json(
        { error: 'Name, email, date, and time are required.' },
        { status: 400 }
      );
    }

    const reservationPayload: NewReservation = {
      name,
      email,
      phone: phone || null,
      booking_type: booking_type === 'event' ? 'event' : 'table',
      event_type: event_type || null,
      catering_package: catering_package || null,
      guests: guests || '1-2',
      reservation_date,
      reservation_time,
      notes: notes || null,
      status: 'pending',
    };

    const supabase = getSupabaseServerClient();

    if (supabase) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('reservations')
        .insert([reservationPayload])
        .select()
        .single();

      if (error) {
        console.error('Supabase reservation insert error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to save reservation to database.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Reservation recorded in Supabase.',
        data,
      });
    }

    // In-memory fallback
    const newRecord: Reservation = {
      id: `res-${Date.now()}`,
      name: reservationPayload.name,
      email: reservationPayload.email,
      phone: reservationPayload.phone || null,
      booking_type: reservationPayload.booking_type || 'table',
      event_type: reservationPayload.event_type || null,
      catering_package: reservationPayload.catering_package || null,
      guests: reservationPayload.guests,
      reservation_date: reservationPayload.reservation_date,
      reservation_time: reservationPayload.reservation_time,
      notes: reservationPayload.notes || null,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    mockReservations.unshift(newRecord);

    return NextResponse.json({
      success: true,
      mode: 'mock',
      message: 'Reservation received successfully.',
      data: newRecord,
    });
  } catch (error) {
    console.error('Reservation API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing the reservation.' },
      { status: 500 }
    );
  }
}

// PATCH: Update reservation status (Admin)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Reservation id and new status are required.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    if (supabase) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('reservations')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    }

    // In-memory update
    const index = mockReservations.findIndex((r) => r.id === id);
    if (index !== -1) {
      mockReservations[index] = { ...mockReservations[index], status };
      return NextResponse.json({ success: true, data: mockReservations[index] });
    }

    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
  } catch (error) {
    console.error('Reservation PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}

// DELETE: Delete a reservation (Admin)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, id });
    }

    mockReservations = mockReservations.filter((r) => r.id !== id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Reservation DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
  }
}
