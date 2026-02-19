// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function getEmbedding(text: string) {
  // 'models/'를 붙이는 게 정석이지만, 404가 나면 빼보고, 빼서 나면 붙여보는 수밖에 없습니다.
  // 사용 가능한 모델: 'models/gemini-embedding-001'
  const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });

  try {
    const result = await model.embedContent({
      content: { parts: [{ text }], role: 'user' }
    });
    return result.embedding.values;
  } catch (error: any) {
    // 여기서도 404가 나면 정말로 키 문제 혹은 지역 제한입니다.
    console.error("📍 진짜 최종 에러:", error.message);
    throw error;
  }
}