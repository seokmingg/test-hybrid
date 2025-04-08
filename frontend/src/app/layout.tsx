import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/app/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'JJobGPT Clone',
  description: 'JJobGPT Clone with Next.js and NestJS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
