import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'

import { prisma } from '../../../../libs/prisma'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'
import { timeIntervalsBodySchema } from './schema'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await unstable_getServerSession(req, res, buildNextAuthOptions(req, res))

  if (!session) {
    return res.status(401).end()
  }

  const { intervals } = timeIntervalsBodySchema.parse(req.body)

  await Promise.all(
    intervals.map((interval) =>
      prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      }),
    ),
  )

  return res.status(201).end()
}
