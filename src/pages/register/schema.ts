import { z } from 'zod'

export const registerDefault = {
  username: '',
  name: '',
}

export const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Precisa ter mais de 3 letras.' })
    .regex(/^([a-z\\-]+)$/i, { message: 'Só pode conter letras e hifens.' })
    .transform((value) => value.toLowerCase()),
  name: z.string().min(3, { message: 'Precisa ter mais de 3 letras.' }),
})

export type RegisterFormData = z.infer<typeof registerFormSchema>
