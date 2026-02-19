'use server'

import { getEmbedding } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function embedRestaurantsAction() {
  try {
    // 1. 아직 임베딩이 없는 식당들만 가져오기
    const { data: restaurants, error: fetchError } = await supabase
      .from('restaurants')
      .select('id, name, category_full, address')
      .is('embedding', null);

    if (fetchError) throw fetchError;
    if (!restaurants || restaurants.length === 0) {
      return { success: true, message: "이미 모든 식당이 지능을 갖췄습니다! 어흥!" };
    }

    console.log(`🐯 ${restaurants.length}개의 식당에 지능 주입 시작...`);

    // 2. 루프를 돌며 임베딩 생성 및 저장
    for (const res of restaurants) {
      // AI가 이해하기 좋게 문장으로 합치기
      const combinedText = `식당명: ${res.name}, 카테고리: ${res.category_full}, 주소: ${res.address}`;
      
      const vector = await getEmbedding(combinedText);

      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ embedding: vector })
        .eq('id', res.id);

      if (updateError) console.error(`❌ ${res.name} 저장 실패:`, updateError.message);
    }

    return { success: true, count: restaurants.length };
  } catch (error) {
    console.error("❌ 임베딩 작업 중 오류:", error);
    return { success: false, error: "지능 주입 실패!" };
  }
}