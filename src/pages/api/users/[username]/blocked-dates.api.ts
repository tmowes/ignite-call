import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { year, month } = req.query

  if (!year || !month) {
    return res.status(400).json({ message: 'Year or month not specified.' })
  }

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: { week_day: true },
    where: { user_id: user.id },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter(
    (weekDay) => !availableWeekDays.some(({ week_day }) => week_day === weekDay),
  )

  // TODO: change MYSQL to fix this query
  // const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
  //   SELECT
  //     EXTRACT(DAY FROM S.DATE) AS date,
  //     COUNT(S.date) AS amount,
  //     ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) AS size
  //   FROM schedulings S
  //   LEFT JOIN user_time_intervals UTI
  //     ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))
  //   WHERE S.user_id = ${user.id}
  //     AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}
  //   GROUP BY EXTRACT(DAY FROM S.DATE),
  //     ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)
  //   HAVING amount >= size
  // `

  // const blockedDates = blockedDatesRaw.map((item) => item.date)
  const blockedDates = [1, 2, 3, 29]

  return res.json({ blockedWeekDays, blockedDates })
}
