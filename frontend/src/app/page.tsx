'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Chat from '@/components/Chat'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div>Loading...</div>

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">JJobGPT Clone</h1>
        {session ? (
          <div className="mb-4">
            <p>Welcome, {session.user?.name}</p>
            <button
              onClick={() => signOut()}
              className="text-blue-500 hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <p className="mb-2">무료로 5번까지 채팅이 가능합니다.</p>
            <button
              onClick={() => signIn()}
              className="text-blue-500 hover:underline"
            >
              무제한 사용을 위해 로그인하기
            </button>
          </div>
        )}
        <Chat />
      </div>
    </main>
  )
}
