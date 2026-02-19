'use client'

import { createReview } from '@/app/actions/create-review';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

// 미리 정의된 태그 리스트 (나중에 RAG가 분류하기 좋습니다)
const TAG_OPTIONS = ['#가성비', '#분위기좋은', '#해장추천', '#혼밥가능', '#빨리나옴', '#친절함'];

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    const result = await createReview({
      restaurantId: resolvedParams.id,
      rating,
      hashtags: selectedTags,
      comment
    });

    if (result.success) {
      alert('🐯 리뷰 사냥 완료! 목록으로 돌아갑니다.');
      router.push('/restaurants');
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">😋 어떠셨나요? (ID: {resolvedParams.id})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 별점 선택 (간단히 숫자로) */}
          <div className="space-y-2">
            <label className="font-bold">별점: {rating}점</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(num => (
                <Button 
                  key={num} 
                  variant={rating === num ? 'default' : 'outline'}
                  onClick={() => setRating(num)}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>

          {/* 태그 선택 */}
          <div className="space-y-2">
            <label className="font-bold">태그 선택</label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map(tag => (
                <Badge 
                  key={tag} 
                  className="cursor-pointer px-3 py-1 text-sm"
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* 한 줄 평 */}
          <div className="space-y-2">
            <label className="font-bold">한 줄 평</label>
            <Textarea 
              placeholder="식당에 대한 솔직한 생각을 적어주세요." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <Button className="w-full" size="lg" onClick={handleSubmit}>
            평가 완료 (사냥 종료)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}