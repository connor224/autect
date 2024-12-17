'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">AutectBot</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/features" className="hover:underline">Features</Link></li>
            <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
          </ul>
        </nav>
        <div>
          {status === 'authenticated' && session ? (
            <div className="flex items-center space-x-4">
              <Image
                src={session.user.image || '/default-avatar.png'}
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <button
                onClick={() => signOut()}
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('discord')}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition-colors"
            >
              Login with Discord
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

