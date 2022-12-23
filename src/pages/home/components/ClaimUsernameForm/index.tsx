import { Button, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ClaimUsernameFormData, claimUsernameFormSchema } from './schema'
import { Form, FormAnnotation } from './styles'

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormData>({
    defaultValues: { username: '' },
    resolver: zodResolver(claimUsernameFormSchema),
  })

  const onClaimUsername = async (data: ClaimUsernameFormData) => {
    console.log(data.username)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(onClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />
        <Button size="sm" type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username ? errors.username.message : 'Digite o nome do usuário desejado'}
        </Text>
      </FormAnnotation>
    </>
  )
}
