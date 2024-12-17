import { getServerSession } from "next-auth/next"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to AutectBot Dashboard</h1>
      <p>You are signed in as {session.user?.name}</p>
    </div>
  )
}

