import { z } from 'zod'

export const updateProfileBodySchema = z.object({ bio: z.string() })
