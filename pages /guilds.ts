import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect().catch(console.error);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const guilds = await redisClient.get(`guilds:${session.user.id}`)
    
    if (!guilds) {
      res.status(404).json({ error: 'Guilds not found' })
      return
    }

    res.status(200).json(JSON.parse(guilds))
  } catch (error) {
    console.error('Error in guilds API route:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

