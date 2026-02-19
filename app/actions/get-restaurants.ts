'use server'

import { supabase } from '@/lib/supabase';
import { Restaurant } from '@/types/restaurant';

export async function getRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("❌ 데이터 로드 실패:", error.message);
    return [];
  }

  return data;
}