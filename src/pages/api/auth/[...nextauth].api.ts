/* eslint-disable no-return-await */
import NextAuth, { NextAuthOptions } from 'next-auth'
import type { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

import { PrismaAdapter } from '../../../libs/next-auth/adapter'

export function buildNextAuthOptions(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
) {
  return {
    adapter: PrismaAdapter(req, res),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        authorization: {
          params: {
            scope:
              'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar',
          },
        },
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            username: '',
            email: profile.email,
            emailVerified: null,
            avatar_url: profile.picture,
          }
        },
      }),
    ],
    callbacks: {
      async signIn({ account }) {
        if (!account?.scope?.includes('https://www.googleapis.com/auth/calendar')) {
          return '/register/connect-calendar?error=permissions'
        }
        return true
      },
      async session({ session, user }) {
        return { ...session, user }
      },
    },
  } as NextAuthOptions
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  await NextAuth(req, res, buildNextAuthOptions(req, res))
}
