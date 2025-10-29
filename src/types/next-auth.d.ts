import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      uuid: string
      nickname: string
      email: string
      avatar_url: string
      created_at: string
    }
  }

  interface User {
    uuid: string
    nickname: string
    email: string
    avatar_url: string
    created_at: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      uuid: string
      nickname: string
      email: string
      avatar_url: string
      created_at: string
    }
  }
}