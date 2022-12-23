import type { NextApiRequest, NextApiResponse } from 'next'

import { setCookie } from 'nookies'

import { COOKIE_MAX_7DAYS, COOKIE_USERID } from '../../../helpers/cookie'
import { prisma } from '../../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = req.body

  const userExists = await prisma.user.findUnique({ where: { username } })

  if (userExists) {
    return res.status(400).json({ error: 'Username already exists' })
  }

  const user = await prisma.user.create({ data: { name, username } })

  console.log('users-created', COOKIE_USERID, COOKIE_MAX_7DAYS, user.id)

  setCookie({ res }, COOKIE_USERID, user.id, { maxAge: COOKIE_MAX_7DAYS, path: '/' })

  return res.status(201).json(user)
}
