export interface User {
  id: string;
  email: string;
  password?: string;
  googleId?: string;
  kakaoId?: string;
  name?: string;
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
} 