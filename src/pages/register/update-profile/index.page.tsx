import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'

import { Avatar, Button, Heading, MultiStep, Text, TextArea } from '@ignite-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ArrowRight } from 'phosphor-react'

import { UpdateProfileData, updateProfileSchema } from './schema'
import { api } from '../../../libs/axios'
import { Container, Header } from '../styles'
import { FormAnnotation, ProfileBox } from './styles'
import { buildNextAuthOptions } from '../../api/auth/[...nextauth].api'

export default function UpdateProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const session = useSession()
  const { push } = useRouter()

  const onUpdateProfile = async ({ bio }: UpdateProfileData) => {
    try {
      await api.put('/users/profile', { bio })
      await push(`/schedule/${session.data?.user.username}`)
    } catch (error) {
      console.error(error)
    }
  }

  console.log(session)

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas
          informações depois.
        </Text>

        <MultiStep size={4} currentStep={4} />
      </Header>

      <ProfileBox as="form" onSubmit={handleSubmit(onUpdateProfile)}>
        <label>
          <Text>Foto de perfil</Text>
          <Avatar
            src={session.data?.user.avatar_url}
            referrerPolicy="no-referrer"
            alt={session.data?.user.name}
          />
        </label>

        <label>
          <Text size="sm">Sobre você</Text>
          <TextArea {...register('bio')} />
          <FormAnnotation size="sm">
            Fale um pouco sobre você. Isto será exibido em sua página pessoal.
          </FormAnnotation>
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Finalizar
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, buildNextAuthOptions(req, res))
  return { props: { session } }
}
