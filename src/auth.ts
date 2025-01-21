/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { createUser, loggedAsAdmin } from '@/server-actions/actions'

import { User } from 'types'
import { db } from './db'

// ? To see the current providers
// $ http://localhost:3000/api/auth/providers  


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Github, Google],
  session: {
    maxAge: 86400, // 86400 = 1 day
    updateAge: 43200 //60 * 60, // Opcional: actualiza la sesión cada 1 hora
  },
  jwt: {
    maxAge: 86400 // 10 * 180 // 30 minutes
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const { name, email, image } = user as User

        // console.log('User', user)

        const userFound = await loggedAsAdmin(email) // We need to know if the user is an admin or not

        if (!userFound) {
          await createUser(name, email, image)
          return false
        }

        // ! MODIFY THIS BECAUSE EVERY USER CAN ACCESS TO OUR APP
        // ! BUT ADMINS WILL BE REDIRECT TO OTHER ADMIN ROUTE
        if (userFound.role == "ADMIN") return true

        return false
      } catch (error) {
        console.error("We found the following error: ", error)
        return false
      }
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await db.user.findUnique({
          where: {
            email: profile.email!
          }
        })
        if (user) {
          token.id = user?.id
          token.iat = Math.floor(Date.now() / 1000)
          token.exp = Math.floor(Date.now() / 1000) + 86400

          // const now = Math.floor(Date.now() / 1000);
          // const timeUntilExpiration = token.exp - now; // Si el token tiene menos de 5 minutos antes de expirar, renovarlo
          // if (timeUntilExpiration < 5 * 60) token.exp = now + 10 * 60; // Renovar el token estableciendo un nuevo tiempo de expiración
        }
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      //Object.assign(session, { id: token.id });
      if (token) {
        session.user.id = String(token.id)
        session.token = token
        session.user.sub = String(token.sub) // Says who is the owner of the token
        session.user.jti = String(token.jti) // Unique identifier for the JWT
        session.user.iat = String(token.iat)
        session.user.exp = String(token.exp)

        //session.expires = new Date(token.exp! * 1000).toISOString();
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url?.startsWith(baseUrl)) return url
      return '/resumes'
    },
  },
  pages: {
    signIn: '/resumes',
    signOut: '',
    error: '/'
  }
})

