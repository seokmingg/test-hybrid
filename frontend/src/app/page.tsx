'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Chat from '@/components/Chat'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div>Loading...</div>

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">ChatGPT Clone</h1>
        {session ? (
          <>
            <div className="mb-4">
              <p>Welcome, {session.user?.name}</p>
              <button
                onClick={() => signOut()}
                className="text-blue-500 hover:underline"
              >
                Logout
              </button>
            </div>
            <Chat />
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-blue-500 hover:underline"
          >
            Login
          </button>
        )}
      </div>
    </main>
  )
}
