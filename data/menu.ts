export interface MenuItemData {
  id?: string;
  name: string;
  desc: string;
  price?: string;
}

export type MenuCategoryKey = 'hot' | 'cold' | 'food' | 'treats';

export interface CategoryInfo {
  key: MenuCategoryKey;
  label: string;
}

export const MENU_CATEGORIES: CategoryInfo[] = [
  { key: 'hot', label: 'Hot Drinks' },
  { key: 'cold', label: 'Cold Drinks' },
  { key: 'food', label: 'Food' },
  { key: 'treats', label: 'Sweet Treats' },
];

export const INITIAL_MENU_DATA: Record<MenuCategoryKey, MenuItemData[]> = {
  hot: [
    { name: 'Espresso', desc: 'Single or double shot, rich & intense' },
    { name: 'Cappuccino', desc: 'Espresso, steamed milk & silky foam' },
    { name: 'Latte', desc: 'Smooth espresso with velvety steamed milk' },
    { name: 'Americano', desc: 'Long black with hot water' },
    { name: 'Flat White', desc: 'Double ristretto with microfoam' },
    { name: 'Hot Chocolate', desc: 'Rich, creamy & warming' },
    { name: 'Tea', desc: "Barry's Tea – Irish breakfast & herbal" },
  ],
  cold: [
    { name: 'Iced Latte', desc: 'Chilled espresso with cold milk over ice' },
    { name: 'Iced Americano', desc: 'Double shot espresso over ice' },
    { name: 'Cold Brew', desc: 'Slow-steeped, smooth & refreshing' },
    { name: 'Iced Mocha', desc: 'Chocolate, espresso & cold milk on ice' },
    { name: 'Smoothie', desc: 'Seasonal fruits blended fresh' },
    { name: 'Fresh Juice', desc: 'Orange or apple, pressed daily' },
  ],
  food: [
    { name: 'Toasted Sandwich', desc: 'Ham & cheese or tuna melt' },
    { name: 'Soup of the Day', desc: 'Homemade, served with bread' },
    { name: 'Sausage Roll', desc: 'Flaky pastry, hearty filling' },
    { name: 'Wrap', desc: 'Chicken or veggie, fresh & filling' },
    { name: 'Quiche', desc: 'Homemade, served with side salad' },
    { name: 'Salad Bowl', desc: 'Seasonal greens, light & fresh' },
  ],
  treats: [
    { name: 'Scone', desc: 'Plain or fruit, with butter & jam' },
    { name: 'Croissant', desc: 'Buttery, flaky & golden' },
    { name: 'Muffin', desc: 'Blueberry or chocolate chip' },
    { name: 'Brownie', desc: 'Rich, fudgy & indulgent' },
    { name: 'Cookie', desc: 'Freshly baked, warm & chewy' },
    { name: 'Cake Slice', desc: "Ask for today's selection" },
  ],
};
