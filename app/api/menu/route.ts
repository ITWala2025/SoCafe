import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { INITIAL_MENU_DATA } from '@/data/menu';
import type { MenuItem } from '@/types/supabase';

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const items = data as unknown as MenuItem[];
        // Group by category slug
        const grouped = {
          hot: items.filter((item) => item.category_slug === 'hot'),
          cold: items.filter((item) => item.category_slug === 'cold'),
          food: items.filter((item) => item.category_slug === 'food'),
          treats: items.filter((item) => item.category_slug === 'treats'),
        };

        return NextResponse.json({
          source: 'supabase',
          data: grouped,
        });
      }
    }

    // Default static fallback
    return NextResponse.json({
      source: 'static',
      data: INITIAL_MENU_DATA,
    });
  } catch (error) {
    console.error('Menu API error:', error);
    return NextResponse.json({
      source: 'static-fallback',
      data: INITIAL_MENU_DATA,
    });
  }
}
