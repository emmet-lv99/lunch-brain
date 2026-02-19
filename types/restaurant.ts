export interface Restaurant {
  id: string;
  name: string;
  category_full: string | null;
  category_main: string | null;
  category_sub: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  embedding: number[] | null; // 벡터 데이터
  created_at: string;
  updated_at: string;
}