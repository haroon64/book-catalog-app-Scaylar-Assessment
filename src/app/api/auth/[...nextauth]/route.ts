import NextAuth from 'next-auth'
import AppleProvider from 'next-auth/providers/apple'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from '@/lib/prisma'
import { compare } from "bcryptjs"

export default NextAuth({
  providers: [
    
     CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email }
        })

        if (!user) throw new Error("User not found")

        const isValid = await compare(credentials!.password, user.password)

        if (!isValid) throw new Error("Invalid password")

        return { id: user.id, name: user.name, email: user.email }
      },
    }),

    // OAuth authentication providers...

    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    }),
    // Passwordless / email sign in
    EmailProvider({
      server: process.env.MAIL_SERVER,
      from: 'NextAuth.js <no-reply@example.com>'
    }),
  ]
    session: {
    strategy: "jwt",
  },
})