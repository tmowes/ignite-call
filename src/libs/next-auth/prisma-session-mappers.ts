/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line import/no-unresolved
import { AdapterSession } from 'next-auth/adapters'

import { Session as RawSession } from '@prisma/client'

import { Replace } from '../../helpers/types'

export type PrismaNewSession = Replace<RawSession, { id?: string }>

export class PrismaSessionMapper {
  static toPrisma(raw: Partial<AdapterSession>): PrismaNewSession {
    return {
      expires: raw.expires!,
      session_token: raw.sessionToken!,
      user_id: raw.userId!,
    }
  }

  static toAuthAdapter(raw: RawSession): AdapterSession {
    return {
      expires: raw.expires,
      sessionToken: raw.session_token,
      userId: raw.user_id,
    }
  }
}
