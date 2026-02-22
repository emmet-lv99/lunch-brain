'use server'

import { supabase } from '@/lib/supabase';
import { Restaurant } from '@/types/restaurant';

export async function getRestaurants(page: number = 0, limit: number = 20): Promise<{ restaurants: Restaurant[], totalCount: number }> {
  const from = page * limit;
  const to = from + limit - 1;

  // 🐯 전체 개수와 페이지 데이터를 동시에 가져옵니다.
  const { data, error, count } = await supabase
    .from('restaurants')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error("❌ 데이터 로드 실패:", error.message);
    return { restaurants: [], totalCount: 0 };
  }

  return { 
    restaurants: data || [], 
    totalCount: count || 0 
  };
}

export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`❌ 식당 정보 로드 실패 (ID: ${id}):`, error.message);
    return null;
  }

  return data;
}