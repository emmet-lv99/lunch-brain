'use server'

import { supabase } from '@/lib/supabase';

export async function fetchAllRestaurantsAction(keyword: string) {
  let page = 1;
  let isEnd = false;
  let totalAdded = 0;

  while (!isEnd) {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}&page=${page}`,
      {
        headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
      }
    );

    const data = await res.json();

    // 🐯 [안전 장치 1] data.meta가 없을 경우를 대비합니다.
    if (!data || !data.meta) {
      console.warn(`⚠️ [${keyword}] ${page}페이지에서 meta 정보를 찾을 수 없습니다. 응답 확인:`, data);
      break; 
    }

    const documents = data.documents;
    isEnd = data.meta.is_end;

    // 🐯 [안전 장치 2] 검색 결과가 없으면 즉시 종료
    if (!documents || documents.length === 0) {
      console.log(`📍 [${keyword}] 더 이상 검색 결과가 없습니다.`);
      break;
    }

    const { error } = await supabase.from('restaurants').upsert(
      documents.map((doc: any) => ({
        id: doc.id,
        name: doc.place_name,
        category_main: doc.category_group_name,
        category_sub: doc.category_name.split(' > ').pop(),
        category_full: doc.category_name,
        address: doc.address_name,
        latitude: parseFloat(doc.y), 
        longitude: parseFloat(doc.x),
      }))
    );

    if (error) {
      console.error(`❌ 저장 실패:`, error.message);
      break;
    }

    totalAdded += documents.length;
    page++;

    // 카카오 API는 키워드 검색 시 최대 3페이지(45개)까지만 제공합니다.
    if (page > 3) break;

    // 🐯 [안전 장치 3] API 과부하 방지를 위해 페이지 이동 간에도 아주 살짝 쉽니다.
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return { success: true, total: totalAdded };
}