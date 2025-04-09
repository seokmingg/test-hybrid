import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'
import { JWT } from 'next-auth/jwt'
import { Session } from 'next-auth'

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not defined')
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OAuth credentials are not defined')
}

if (!process.env.KAKAO_CLIENT_ID || !process.env.KAKAO_CLIENT_SECRET) {
  throw new Error('Kakao OAuth credentials are not defined')
}

if (!process.env.SERVER_API_URL) {
  throw new Error('SERVER_API_URL is not defined')
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // JWT에 accessToken 저장
    async jwt({ token, account }: { token: JWT; account: any }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },

    // session 객체에 accessToken 전달
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken
      return session
    },

    // 로그인 허용 여부 판단
    async signIn({ user, account }: { user: any; account: any }) {
      try {
        const res = await fetch(`${process.env.SERVER_API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${account.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            provider: account.provider,
          }),
        })

        if (!res.ok) {
          console.error('❌ 백엔드 응답 실패')
          return false // 로그인 막기
        }

        return true // 로그인 허용
      } catch (err) {
        console.error('❌ signIn 콜백 오류:', err)
        return false // 로그인 막기
      }
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }