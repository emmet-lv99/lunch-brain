'use server'

import { getEmbedding } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function askChatbot(message: string) {
  try {
    // 🐯 여기서 에러가 났던 겁니다. 이제 수리된 getEmbedding이 작동합니다.
    const queryVector = await getEmbedding(message);

    // 3072차원으로 수정된 RPC 호출
    const { data: matchedRestaurants, error: matchError } = await supabase.rpc('match_restaurants', {
      query_embedding: queryVector,
      match_threshold: 0.2, // 테스트를 위해 조금 낮춰봅니다.
      match_count: 5
    });

    if (matchError) throw matchError;

    // 3. 검색된 식당 정보를 텍스트로 정리
    const context = matchedRestaurants
      .map((r: any) => `- ${r.name} (${r.category_main}): ${r.category_sub}`)
      .join('\n');

    // 4. Gemini에게 답변 생성 요청 (프롬프트 엔지니어링)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      너는 맛집 추천 전문가 '런치 브레인 🐯'이야. 
      아래 제공된 식당 정보를 바탕으로 사용자의 질문에 친절하고 위트있게 대답해줘.
      식당 정보가 없다면 아는 척 하지 말고 정중하게 모른다고 해.

      [검색된 식당 정보]
      ${context}

      [사용자 질문]
      ${message}
    `;

    const result = await model.generateContent(prompt);
    return { success: true, answer: result.response.text() };
  } catch (error: any) {
    console.error("❌ 챗봇 오류:", error.message);
    return { success: false, error: "호랑이가 잠시 자리를 비웠습니다." };
  }
}