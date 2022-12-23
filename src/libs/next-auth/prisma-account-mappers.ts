/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Account } from 'next-auth'

import { Account as RawAccount } from '@prisma/client'

import { Replace } from '../../helpers/types'

export type PrismaNewAccount = Replace<RawAccount, { id?: string }>

export class PrismaAccountMapper {
  static toPrismaAdapter(raw: Account): PrismaNewAccount {
    return {
      user_id: raw.userId!,
      type: raw.type,
      provider: raw.provider,
      provider_account_id: raw.providerAccountId,
      refresh_token: raw.refresh_token!,
      access_token: raw.access_token!,
      expires_at: raw.expires_at!,
      token_type: raw.token_type!,
      scope: raw.scope!,
      id_token: raw.id_token!,
      session_state: raw.session_state!,
    }
  }

  static toAuthAdapter(raw: RawAccount): Account {
    return {
      provider: raw.provider,
      providerAccountId: raw.provider_account_id,
      type: 'oauth',
      id: raw.id,
      access_token: raw.access_token!,
      refresh_token: raw.refresh_token!,
      expires_at: raw.expires_at!,
      scope: raw.scope!,
      token_type: raw.token_type!,
      userId: raw.user_id,
      id_token: raw.id_token!,
      session_state: raw.session_state!,
    }
  }
}
