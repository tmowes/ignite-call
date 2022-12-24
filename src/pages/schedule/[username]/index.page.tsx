import { GetStaticPaths, GetStaticProps } from 'next'

import { Avatar, Heading, Text } from '@ignite-ui/react'

import { prisma } from '../../../libs/prisma'
import { Container, UserHeader } from './styles'
import { SchedulePageProps } from './types'
import { ScheduleForm } from './components/ScheduleForm'

export default function SchedulePage(props: SchedulePageProps) {
  const { user } = props
  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatarUrl} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}</Text>
      </UserHeader>

      <ScheduleForm />
    </Container>
  )
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
})

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}
