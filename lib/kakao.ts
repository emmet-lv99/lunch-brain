import axios from 'axios';

export const kakaoApi = axios.create({
  baseURL: 'https://dapi.kakao.com/v2/local',
  headers: {
    Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
  },
});