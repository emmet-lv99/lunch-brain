'use client'

import { Restaurant } from '@/types/restaurant';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getRestaurants } from '../actions/get-restaurants';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 🐯 초기 데이터와 추가 데이터를 가져오는 함수
  const fetchMoreData = async (currentPage: number) => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const { restaurants: newRestaurants, totalCount: total } = await getRestaurants(currentPage, 15);
    
    if (newRestaurants.length === 0) {
      setHasMore(false);
    } else {
      setRestaurants(prev => {
        // 🐯 기존 리스트에 이미 있는 ID는 제외하고 추가합니다 (중복 키 에러 방지)
        const existingIds = new Set(prev.map(r => r.id));
        const filteredNew = newRestaurants.filter(r => !existingIds.has(r.id));
        return [...prev, ...filteredNew];
      });
      setTotalCount(total);
      setPage(currentPage + 1);
      
      // 🐯 전체 개수에 도달했는지 확인
      if (restaurants.length + newRestaurants.length >= total) {
        setHasMore(false);
      }
    }
    setLoading(false);
  };

  // 🐯 마운트 시 첫 페이지 로드
  useEffect(() => {
    fetchMoreData(0);
  }, []);

  // 🐯 무한 스크롤 관찰자 설정
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchMoreData(page);
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [page, hasMore, loading]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 🐯 헤더: 목록 요약 */}
      <div className="px-6 py-8 bg-white border-b border-slate-100 flex flex-col gap-1 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">
            🐯 사냥 완료 목록
        </h1>
        <p className="text-sm font-bold text-slate-500">
           강남역 인근 <span className="text-blue-600 font-extrabold">{totalCount}개</span>의 맛집을 확보했다 어흥!
        </p>
      </div>

      {/* 🐯 리스트 영역 */}
      <div className="px-4 py-6 flex flex-col gap-4">
        {restaurants.map((res: Restaurant) => (
          <div key={res.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md group">
            <Link href={`/restaurants/${res.id}/review`}>
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-lg font-bold text-slate-900 truncate pr-2 group-hover:text-blue-600 transition-colors tracking-tight">{res.name}</h2>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-tight shrink-0">
                  {res.category_main}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 mb-4">{res.category_sub}</p>
              
              <div className="flex items-center gap-1.5 text-slate-500 mb-5">
                <span className="text-[11px] font-medium truncate leading-relaxed opacity-70">{res.address}</span>
              </div>
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <a 
                href={`https://map.kakao.com/link/map/${encodeURIComponent(res.name || '')},${res.latitude},${res.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2.5 bg-slate-50 rounded-xl flex items-center justify-center gap-1.5 border border-slate-100 hover:bg-slate-100 active:scale-95 transition-all"
              >
                 <span className="text-[10px] font-bold text-slate-500 tracking-tighter italic">📍 Map</span>
              </a>
              <Link 
                href={`/restaurants/${res.id}/review`}
                className="px-3 py-2.5 bg-yellow-400 rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:bg-yellow-500 active:scale-95 transition-all"
              >
                 <span className="text-[10px] font-black text-yellow-900 tracking-tighter">리뷰 작성하기</span>
              </Link>
            </div>
          </div>
        ))}

        {/* 🐯 로딩/끝 표시기 */}
        <div ref={loadMoreRef} className="py-8 flex justify-center">
          {loading && (
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
            </div>
          )}
          {!hasMore && restaurants.length > 0 && (
            <p className="text-xs font-bold text-slate-400 italic">모든 사냥터를 확인했다 어흥! 🐯</p>
          )}
        </div>

        {restaurants.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="text-5xl mb-4 grayscale opacity-30">🐯</div>
            <p className="text-sm font-bold text-slate-400">아직 사냥한 식당이 없습니다.<br/>메인에서 출동 명령을 내려달라 어흥!</p>
          </div>
        )}
      </div>
    </div>
  );
}