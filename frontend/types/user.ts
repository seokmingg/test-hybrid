export interface User {
  id: string;
  email: string;
  name: string;
  provider: 'google' | 'kakao';
  googleId: string | null;
  kakaoId: string | null;
  picture: string | null;
  password: string | null;
  createdAt: string;
  updatedAt: string;
} 