/* eslint-disable no-return-await */
import NextAuth, { NextAuthOptions } from 'next-auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import GoogleProvider from 'next-auth/providers/google'

import { PrismaAdapter } from '../../../libs/next-auth/adapter'

export function buildNextAuthOptions(req: NextApiRequest, res: NextApiResponse) {
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
      }),
    ],
    callbacks: {
      async signIn({ account }) {
        if (!account?.scope?.includes('https://www.googleapis.com/auth/calendar')) {
          return '/register/connect-calendar?error=permissions'
        }
        return true
      },
    },
  } as NextAuthOptions
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  await NextAuth(req, res, buildNextAuthOptions(req, res))
}
