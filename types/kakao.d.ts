export interface KakaoAddress {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string; // 경도
  y: string; // 위도
}

export interface KakaoSearchResponse {
  meta: {
    is_end: boolean;
    pageable_count: number;
    total_count: number;
  };
  documents: KakaoAddress[];
}