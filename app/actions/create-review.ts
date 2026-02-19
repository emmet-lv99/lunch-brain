'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

interface ReviewInput {
  restaurantId: string;
  rating: number;
  hashtags: string[];
  comment: string;
}

export async function createReview(input: ReviewInput) {
  const { error } = await supabase.from('reviews').insert([
    {
      restaurant_id: input.restaurantId,
      rating: input.rating,
      hashtags: input.hashtags,
      comment: input.comment,
    },
  ]);

  if (error) {
    console.error("❌ 리뷰 저장 실패:", error.message);
    return { success: false, error: error.message };
  }

  // 데이터가 변했으니 리스트 페이지를 새로고침하라고 명령! (Next.js 캐시 무효화)
  revalidatePath('/restaurants');
  return { success: true };
}