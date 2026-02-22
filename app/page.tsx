'use client'

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { embedRestaurantsAction } from './actions/embed-restaurants';
import { fetchAllRestaurantsAction } from './actions/fetch-restaurants';

// 🐯 정예 사냥 키워드 리스트
const HUNTER_KEYWORDS = [
  "강남역 맛집", "강남역 일식", "강남역 한식", "강남역 고기집", "강남역 카페", "강남역 술집", "강남역 혼밥",
  "강남역 가성비 맛집", "강남역 소개팅", "강남역 디저트카페", "강남역 이자카야", "강남역 브런치", 
  "강남역 와인바", "강남역 점심특선", "강남역 무한리필", "강남역 수제버거", "강남역 마라탕", "강남역 24시 식당", 
  "강남역 단체회식", "강남역 조용한 식당", "강남역 햄버거", "강남역 쌀국수", "강남역 떡볶이", "강남역 파스타", 
  "강남역 돈까스", "강남역 우동", "강남역 소바", "강남역 짬뽕", "강남역 닭갈비", "강남역 곱창", 
  "강남역 삼겹살", "강남역 스테이크", "강남역 샐러드", "강남역 샌드위치", "강남역 포케", "강남역 커리", 
  "강남역 타코", "강남역 딤섬", "강남역 규카츠", "강남역 사케동", "강남역 텐동", "강남역 야키소바", 
  "강남역 오코노미야키", "강남역 분짜", "강남역 나시고랭", "강남역 똠양꿍", "강남역 훠궈", "강남역 양꼬치", 
  "강남역 화덕피자", "강남역 뇨끼", "강남역 리조또", "강남역 라자냐", "강남역 젤라또", "강남역 수플레팬케이크", 
  "강남역 마카롱", "강남역 빙수", "강남역 도넛", "강남역 족발", "강남역 아구찜", "강남역 샤브샤브"
];

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
  };

  // 1. 실시간 중계 자동 사냥 (중복 체크 포함)
  const handleAutoFetch = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setLogs([]);
    addLog("🚀 대규모 사냥 작전 개시!");

    try {
      // 📜 사냥 기록지 먼저 확인
      addLog("📜 사냥 기록지를 대조하고 있습니다...");
      const { data: crawledData } = await supabase
        .from('crawled_keywords')
        .select('keyword');
      
      const crawledKeywords = new Set(crawledData?.map(d => d.keyword) || []);
      let totalGrandCount = 0;

      for (const keyword of HUNTER_KEYWORDS) {
        // 이미 사냥한 키워드면 빛의 속도로 스킵!
        if (crawledKeywords.has(keyword)) {
          addLog(`⏩ [${keyword}] 이미 정복한 사냥터입니다. 건너뜁니다.`);
          continue;
        }

        addLog(`📍 [${keyword}] 신규 사냥터 수색 중...`);
        const result = await fetchAllRestaurantsAction(keyword);
        
        // 🐯 결과가 1개라도 있을 때만 성공으로 간주하고 기록
        if (result.success && result.total > 0) {
          totalGrandCount += result.total;
          
          // 기록지에 추가하여 다음엔 스킵되게 함
          await supabase.from('crawled_keywords').insert({ keyword });
          addLog(`✅ [${keyword}] 사냥 완료: ${result.total}개 확보`);
        } else {
          addLog(`⚠️ [${keyword}] 결과가 없습니다. (기록하지 않음)`);
        }

        // API 매너 타임
        await new Promise(r => setTimeout(r, 600));
      }

      addLog(`🏁 작전 종료! 새롭게 ${totalGrandCount}개의 전리품을 챙겼습니다. 어흥!`);
    } catch (error) {
      addLog("❌ 사냥 중 예상치 못한 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. 지능 주입 (Embedding) 중계
  const handleEmbed = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    addLog("🧠 식당 지능 주입(Embedding) 작전 시작...");

    try {
      // 한 번에 모든 식당을 처리하는 대신, 내부적으로 반복 실행 가능하도록 액션 호출
      // (만약 액션이 이미 전체 처리를 하도록 짜여있다면 그대로 사용)
      const result = await embedRestaurantsAction();
      
      if (result.success) {
        addLog(`✨ ${result.count || 0}개의 식당에 지능을 넣었습니다!`);
        if (result.count === 0) addLog("ℹ️ 새로 주입할 지능이 없습니다. 이미 모두 똑똑합니다.");
      } else {
        addLog(`⚠️ ${result.message}`);
      }
    } catch (error) {
      addLog("❌ 지능 주입 중 에러가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 gap-6 pt-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          🐯 런치 브레인 <span className="text-blue-600">터미널</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium tracking-wide">강남역 맛집 데이터를 실시간으로 사냥합니다 어흥!</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
        <Button 
          onClick={handleAutoFetch} 
          variant="default" 
          className="h-14 text-base font-bold bg-red-600 hover:bg-red-700 shadow-lg active:scale-95 transition-transform"
          disabled={isProcessing}
        >
          {isProcessing ? "작전 수행 중..." : "🔥 자동 대량 사냥 개시"}
        </Button>
        <Button 
          onClick={handleEmbed} 
          className="h-14 text-base font-bold bg-slate-800 hover:bg-slate-900 shadow-md active:scale-95 transition-transform"
          disabled={isProcessing}
        >
          🧠 식당 지능 주입 (Embedding)
        </Button>
      </div>

      {/* 🐯 실시간 로그 관제창 */}
      <div className="w-full mt-2">
        <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl h-[400px] overflow-y-auto font-mono text-[12px] border border-slate-800 shadow-2xl relative scrollbar-hide">
          <div className="sticky top-0 bg-slate-950/90 backdrop-blur-sm pb-2 mb-2 border-b border-slate-800 flex justify-between items-center">
             <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Terminal Output</span>
             <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
             </div>
          </div>
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 italic gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-blue-500 animate-spin" />
              대기 중... 사냥을 시작하세요!
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {logs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-left-2 break-all leading-relaxed">
                  <span className="text-blue-500 mr-2 opacity-80">tiger@hunt ~ %</span>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}