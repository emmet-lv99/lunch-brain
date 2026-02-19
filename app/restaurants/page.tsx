import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Restaurant } from '@/types/restaurant';
import Link from 'next/link';
import { getRestaurants } from '../actions/get-restaurants';

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🐯 런치 브레인 사냥 목록</h1>
        <p className="text-muted-foreground">총 {restaurants.length}개의 맛집 발견</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((res: Restaurant) => (
          <Link href={`/restaurants/${res.id}/review`} key={res.id}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">{res.name}</CardTitle>
                  <Badge variant="secondary">{res.category_main}</Badge>
                </div>
                <CardDescription>{res.category_sub}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{res.address}</p>
                <div className="mt-4 flex gap-2">
                  <Badge variant="outline" className="text-xs">📍 지도보기</Badge>
                  <Badge variant="outline" className="text-xs">⭐ 리뷰쓰기</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">아직 사냥한 식당이 없습니다. 메인에서 수집을 먼저 해주세요! 어흥!</p>
        </div>
      )}
    </div>
  );
}