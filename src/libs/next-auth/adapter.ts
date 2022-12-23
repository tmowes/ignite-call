// eslint-disable-next-line import/no-unresolved
import { Adapter } from 'next-auth/adapters'
import type { NextApiRequest, NextApiResponse } from 'next'

import { parseCookies, destroyCookie } from 'nookies'

import { prisma } from '../prisma'
import { PrismaAccountMapper } from './prisma-account-mappers'
import { PrismaUserMapper } from './prisma-user-mappers'
import { PrismaSessionMapper } from './prisma-session-mappers'
import { COOKIE_USERID } from '../../helpers/cookie'

export function PrismaAdapter(req: NextApiRequest, res: NextApiResponse): Adapter {
  return {
    async createUser(user) {
      const { COOKIE_USERID: userIdOnCookie } = parseCookies({ req })
      if (!userIdOnCookie) {
        throw new Error('User id is required to create user')
      }
      const newUser = await prisma.user.update({
        where: { id: userIdOnCookie },
        data: PrismaUserMapper.toPrisma(user),
      })
      destroyCookie({ res }, COOKIE_USERID, { path: '/' })
      return PrismaUserMapper.toAuthAdapter(newUser)
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({ where: { id } })
      return user ? PrismaUserMapper.toAuthAdapter(user) : null
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({ where: { email } })
      return user ? PrismaUserMapper.toAuthAdapter(user) : null
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const provider_provider_account_id = { provider, provider_account_id: providerAccountId }

      const account = await prisma.account.findUnique({
        where: { provider_provider_account_id },
        include: { user: true },
      })

      return account?.user ? PrismaUserMapper.toAuthAdapter(account.user) : null
    },

    async updateUser(user) {
      if (!user.id) {
        throw new Error('User id is required to update user')
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: PrismaUserMapper.toPrisma(user),
      })

      return PrismaUserMapper.toAuthAdapter(updatedUser)
    },

    async linkAccount(account) {
      await prisma.account.create({ data: PrismaAccountMapper.toPrismaAdapter(account) })
    },
    async createSession(session) {
      const newSession = await prisma.session.create({
        data: PrismaSessionMapper.toPrisma(session),
      })
      return PrismaSessionMapper.toAuthAdapter(newSession)
    },

    async getSessionAndUser(sessionToken) {
      const sessionAndUser = await prisma.session.findUnique({
        where: { session_token: sessionToken },
        include: { user: true },
      })

      if (!sessionAndUser) return null

      const { user, ...session } = sessionAndUser

      return {
        session: PrismaSessionMapper.toAuthAdapter(session),
        user: PrismaUserMapper.toAuthAdapter(user),
      }
    },

    async updateSession(session) {
      const updatedSession = await prisma.session.update({
        where: { session_token: session.sessionToken },
        data: PrismaSessionMapper.toPrisma(session),
      })
      return PrismaSessionMapper.toAuthAdapter(updatedSession)
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({ where: { session_token: sessionToken } })
    },
  }
}
