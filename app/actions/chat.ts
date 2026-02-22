'use server'

import { getEmbedding } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function askChatbot(message: string) {
  try {
    const queryVector = await getEmbedding(message);

    const { data: restaurants, error } = await supabase.rpc('match_restaurants_v2', {
      query_embedding: queryVector,
      match_threshold: 0.5,
      match_count: 5,
    });

    if (error) throw error;

    const context = restaurants?.map((r: any) => `
      식당명: ${r.name}
      카테고리: ${r.category_sub}
      위도: ${r.latitude}
      경도: ${r.longitude}
    `).join('\n---\n');

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // 🐯 프롬프트 강화: 버튼 UI를 위해 링크 형식을 [지도보기](URL)로 고정합니다.
    const prompt = `
너는 맛집 추천 전문가 '런치 브레인 🐯'이야. 
제공된 식당 정보를 바탕으로 답변하되, 반드시 다음 양식을 지켜줘.

[링크 생성 규칙]
1. 추천하는 각 식당 설명이 끝나는 지점에 반드시 [지도보기](링크) 형식을 삽입한다.
2. 링크 주소는 반드시 다음 형식을 엄수한다: https://map.kakao.com/link/map/식당명,위도,경도
   (예: [지도보기](https://map.kakao.com/link/map/김남완초밥집,37.4951,127.0301))
3. 위도와 경도는 제공된 데이터를 소수점 끝까지 정확히 사용한다.
4. 링크 텍스트는 반드시 "지도보기"로 통일한다.
5. **중요: 링크 주소(URL) 내의 식당명에 공백이 포함될 경우, 마크다운 링크가 깨지지 않도록 반드시 공백을 \`%20\`으로 치환하여 작성한다.** (예: \`.../map/오사이초밥%20강남역점,...\`)

[말투]
- 항상 "어흥!"으로 시작하거나 끝내며 씩씩하게 말한다.
- 식당 정보가 없으면 아는 척하지 말고 정중하게 모른다고 한다.

[검색된 식당 정보]
${context}

[사용자 질문]
${message}
    `;

    const result = await model.generateContent(prompt);
    return { success: true, answer: result.response.text() };
  } catch (error: any) {
    console.error("❌ 챗봇 오류:", error.message);
    return { success: false, error: "호랑이가 잠시 자리를 비웠습니다. 다시 시도해달라 어흥!" };
  }
}