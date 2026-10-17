import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { INITIAL_MENU_DATA, type MenuCategoryKey, type MenuItemData } from '@/data/menu';
import type { MenuItem } from '@/types/supabase';

// In-memory store for fallback/dev editing
let memoryMenuItems: Record<MenuCategoryKey, (MenuItemData & { id: string; available?: boolean })[]> = {
  hot: INITIAL_MENU_DATA.hot.map((item, idx) => ({
    ...item,
    id: `hot-${idx + 1}`,
    available: true,
  })),
  cold: INITIAL_MENU_DATA.cold.map((item, idx) => ({
    ...item,
    id: `cold-${idx + 1}`,
    available: true,
  })),
  food: INITIAL_MENU_DATA.food.map((item, idx) => ({
    ...item,
    id: `food-${idx + 1}`,
    available: true,
  })),
  treats: INITIAL_MENU_DATA.treats.map((item, idx) => ({
    ...item,
    id: `treats-${idx + 1}`,
    available: true,
  })),
};

// GET: Fetch menu items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const flat = searchParams.get('flat') === 'true';

    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const items = data as unknown as MenuItem[];
        if (flat) {
          return NextResponse.json({ source: 'supabase', data: items });
        }

        const grouped = {
          hot: items.filter((item) => item.category_slug === 'hot'),
          cold: items.filter((item) => item.category_slug === 'cold'),
          food: items.filter((item) => item.category_slug === 'food'),
          treats: items.filter((item) => item.category_slug === 'treats'),
        };

        return NextResponse.json({ source: 'supabase', data: grouped });
      }
    }

    if (flat) {
      const flattened = [
        ...memoryMenuItems.hot.map((i) => ({ ...i, category_slug: 'hot' })),
        ...memoryMenuItems.cold.map((i) => ({ ...i, category_slug: 'cold' })),
        ...memoryMenuItems.food.map((i) => ({ ...i, category_slug: 'food' })),
        ...memoryMenuItems.treats.map((i) => ({ ...i, category_slug: 'treats' })),
      ];
      return NextResponse.json({ source: 'memory', data: flattened });
    }

    return NextResponse.json({
      source: 'memory',
      data: memoryMenuItems,
    });
  } catch (error) {
    console.error('Menu API GET error:', error);
    return NextResponse.json({ source: 'static-fallback', data: INITIAL_MENU_DATA });
  }
}

// POST: Add new menu item (Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, name, desc, price } = body;

    if (!category || !name || !desc) {
      return NextResponse.json(
        { error: 'Category, item name, and description are required.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    if (supabase) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('menu_items')
        .insert([
          {
            category_slug: category,
            name,
            description: desc,
            price: price || null,
            is_available: true,
            display_order: 99,
          },
        ] as any)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    }

    const catKey = category as MenuCategoryKey;
    const newItem = {
      id: `${catKey}-${Date.now()}`,
      name,
      desc,
      price: price || undefined,
      available: true,
    };

    if (memoryMenuItems[catKey]) {
      memoryMenuItems[catKey].push(newItem);
    }

    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    console.error('Menu API POST error:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

// PUT: Update menu item (Admin)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, category, name, desc, price, available } = body;

    if (!id) {
      return NextResponse.json({ error: 'Item id is required.' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    if (supabase) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('menu_items')
        .update({
          ...(name && { name }),
          ...(desc && { description: desc }),
          ...(price !== undefined && { price }),
          ...(available !== undefined && { is_available: available }),
          ...(category && { category_slug: category }),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    }

    // In-memory update
    for (const cat of ['hot', 'cold', 'food', 'treats'] as MenuCategoryKey[]) {
      const idx = memoryMenuItems[cat].findIndex((item) => item.id === id);
      if (idx !== -1) {
        memoryMenuItems[cat][idx] = {
          ...memoryMenuItems[cat][idx],
          ...(name && { name }),
          ...(desc && { desc }),
          ...(price !== undefined && { price }),
          ...(available !== undefined && { available }),
        };
        return NextResponse.json({ success: true, data: memoryMenuItems[cat][idx] });
      }
    }

    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  } catch (error) {
    console.error('Menu API PUT error:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

// DELETE: Delete menu item (Admin)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item id is required.' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, id });
    }

    for (const cat of ['hot', 'cold', 'food', 'treats'] as MenuCategoryKey[]) {
      memoryMenuItems[cat] = memoryMenuItems[cat].filter((item) => item.id !== id);
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Menu API DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
