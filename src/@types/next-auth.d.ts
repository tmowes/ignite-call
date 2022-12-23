import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    emailVerified: null
    username: string
    avatar_url: string
  }

  interface DefaultUser extends User {}

  interface Session {
    user: User
  }
}
