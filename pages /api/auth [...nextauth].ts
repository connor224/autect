import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { createClient } from 'redis'

if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
  throw new Error("Missing Discord OAuth credentials");
}

if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL");
}

const redisClient = createClient({
  url: process.env.REDIS_URL
})

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect().catch(console.error);

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: 'identify email guilds' } },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord") {
        try {
          const userData = {
            id: profile?.id,
            email: profile?.email,
            name: profile?.username,
            avatar: profile?.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png',
            discriminator: profile?.discriminator,
            blacklist: 0,
            current_bg: "default.png",
            stripe_customer_id: "",
            country: ""
          }

          await redisClient.set(`user:${profile?.id}`, JSON.stringify(userData));

          const guilds = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: {
              Authorization: `Bearer ${account.access_token}`
            }
          }).then(res => res.json());

          await redisClient.set(`guilds:${profile?.id}`, JSON.stringify(guilds));

          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = profile?.id
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user.id = token.id
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)

