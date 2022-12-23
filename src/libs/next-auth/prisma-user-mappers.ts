/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line import/no-unresolved
import { AdapterUser } from 'next-auth/adapters'

import { User } from '@prisma/client'

type UpdateUser = Partial<User>

export class PrismaUserMapper {
  static toPrisma(raw: Omit<AdapterUser, 'id'> | Partial<AdapterUser>): UpdateUser {
    return {
      name: raw.name,
      email: raw.email,
      avatar_url: raw.avatar_url,
    }
  }

  static toAuthAdapter(raw: User): AdapterUser {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email!,
      emailVerified: null,
      username: raw.username,
      avatar_url: raw.avatar_url!,
    }
  }
}
