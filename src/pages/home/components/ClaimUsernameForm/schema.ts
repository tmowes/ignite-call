import { z } from 'zod'

export const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Precisa ter mais de 3 letras.' })
    .regex(/^([a-z\\-]+)$/i, { message: 'Só pode conter letras e hifens.' })
    .transform((value) => value.toLowerCase()),
})

export type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>
