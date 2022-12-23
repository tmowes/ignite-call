import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'

import { registerDefault, RegisterFormData, registerFormSchema } from './schema'
import { Container, Form, FormError, Header } from './styles'

export default function RegisterPage() {
  const { push, query } = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: registerDefault,
    resolver: zodResolver(registerFormSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    const { username } = data
    await push(`/register/${username}`)
    console.log(data)
  }

  useEffect(() => {
    if (query?.username) {
      setValue('username', String(query.username))
    }
  }, [query?.username, setValue])

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas
          informações depois.
        </Text>
        <MultiStep size={4} currentStep={1} />
      </Header>
      <Form as="form" onSubmit={handleSubmit(onSubmit)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            size="sm"
            prefix="ignite.com/"
            placeholder="seu-usuario"
            {...register('username')}
          />
          {errors.username && <FormError size="sm">{errors.username.message}</FormError>}
        </label>
        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput size="sm" placeholder="Seu nome" {...register('name')} />
          {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
        </label>
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
