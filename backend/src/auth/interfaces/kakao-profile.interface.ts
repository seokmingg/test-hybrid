export interface KakaoProfile {
  id: string;
  _json: {
    kakao_account: {
      email: string;
    };
    properties: {
      nickname: string;
      profile_image: string;
    };
  };
} 