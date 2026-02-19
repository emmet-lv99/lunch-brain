'use client'

import { Button } from '@/components/ui/button';
import { autoBatchFetchAction } from './actions/auto-fetch';
import { embedRestaurantsAction } from './actions/embed-restaurants';

export default function Home() {
const handleAutoFetch = async () => {
  const result = await autoBatchFetchAction();
  if (result.success) {
    alert(`대성공! 총 ${result.total}개의 식당 데이터를 확보했습니다! 어흥!`);
  }
};

const handleEmbed = async () => {
    const result = await embedRestaurantsAction();
    if (result.success) {
      alert(result.count ? `${result.count}개의 식당에 지능을 넣었습니다!` : result.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-4xl font-bold mb-8">🐯 런치 브레인 터미널</h1>
      <div className="flex gap-4">
        <Button onClick={handleAutoFetch} variant="destructive" size="lg">
          🔥 자동 대량 사냥 (All Keywords)
        </Button>
        <Button onClick={handleEmbed} size="lg" variant="secondary">2. 식당 지능 주입 (Embedding)</Button>
      </div>
    </main>
  );
}