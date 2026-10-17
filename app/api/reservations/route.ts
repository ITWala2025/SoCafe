import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { NewReservation } from '@/types/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, guests, reservation_date, reservation_time, notes } = body;

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
      guests: guests || '1-2',
      reservation_date,
      reservation_time,
      notes: notes || null,
      status: 'pending',
    };

    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase
        .from('reservations')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert([reservationPayload] as any)
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

    // Fallback when Supabase credentials are not yet configured
    console.log('[Dev Mode] Reservation received (Supabase credentials not configured):', reservationPayload);
    return NextResponse.json({
      success: true,
      mode: 'mock',
      message: 'Reservation received successfully. (Configure Supabase credentials in .env.local to persist to database)',
      data: {
        id: `mock-${Date.now()}`,
        ...reservationPayload,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Reservation API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing the reservation.' },
      { status: 500 }
    );
  }
}
