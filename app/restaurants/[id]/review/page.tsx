'use client'

import { createReview } from '@/app/actions/create-review';
import { getRestaurantById } from '@/app/actions/get-restaurants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Restaurant } from '@/types/restaurant';
import { ChevronLeft, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

const TAG_OPTIONS = ['#가성비', '#분위기좋은', '#해장추천', '#혼밥가능', '#빨리나옴', '#친절함'];

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const data = await getRestaurantById(resolvedParams.id);
      setRestaurant(data);
    };
    fetchRestaurant();
  }, [resolvedParams.id]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    
    const result = await createReview({
      restaurantId: resolvedParams.id,
      rating,
      hashtags: selectedTags,
      comment
    });

    if (result.success) {
      router.push('/restaurants');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 🐯 상단 네비게이션 헤더 */}
      <div className="px-4 py-4 bg-white border-b border-slate-200 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => router.back()}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 truncate flex-1">
          {restaurant?.name || '리뷰 작성'}
        </h1>
      </div>

      <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
        {/* 🐯 별점 섹션 */}
        <section className="space-y-4 text-center py-4">
          <h2 className="text-xl font-black text-slate-900">식사는 어떠셨나요? 😋</h2>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => setRating(num)}
                className="transition-transform active:scale-90"
              >
                <Star 
                  className={`w-10 h-10 ${
                    rating >= num 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-slate-200"
                  }`} 
                />
              </button>
            ))}
          </div>
          <p className="text-sm font-bold text-yellow-600 bg-yellow-50 inline-block px-3 py-1 rounded-full border border-yellow-100 italic">
            {rating === 5 ? "최고예요! 어흥! 🐯" : `${rating}점 사냥 완료!`}
          </p>
        </section>

        {/* 🐯 태그 섹션 */}
        <section className="space-y-3">
          <label className="text-sm font-black text-slate-400 uppercase tracking-widest">이 식당의 매력은?</label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map(tag => {
              const isActive = selectedTags.includes(tag);
              return (
                <Badge 
                  key={tag} 
                  onClick={() => toggleTag(tag)}
                  className={`
                    cursor-pointer px-4 py-2 text-sm font-bold rounded-xl transition-all border-2
                    ${isActive 
                      ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105" 
                      : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}
                  `}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        </section>

        {/* 🐯 한줄평 섹션 */}
        <section className="space-y-3">
          <label className="text-sm font-black text-slate-400 uppercase tracking-widest">솔직한 호랑이의 한마디</label>
          <div className="relative group">
            <Textarea 
              placeholder="식당에 대한 한 줄 평을 남겨달라 어흥!" 
              className="min-h-[120px] rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-0 text-base p-4 transition-all resize-none shadow-sm group-focus-within:shadow-md"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </section>

        {/* 🐯 완료 버튼 */}
        <Button 
          className="w-full h-14 rounded-2xl text-lg font-black bg-slate-900 hover:bg-black shadow-xl active:scale-95 transition-all flex gap-2"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "🐯 리뷰 사냥 완료"
          )}
        </Button>
      </div>
    </div>
  );
}