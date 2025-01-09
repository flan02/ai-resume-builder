import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { createUser, loggedAsAdmin } from '@/server-actions/actions'

import { User } from 'types'


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, account, profile }) {

      try {
        const { name, email, image } = user as User

        //console.log({ user, account, profile });
        //console.log('Current email', email);
        const userFound = await loggedAsAdmin(email) // We need to know if the user is an admin or not

        if (!userFound) {
          await createUser(name, email, image)
          return false

        }
        if (userFound.role == "ADMIN") return true
        return false
      } catch (error) {
        console.error("We found the following error: ", error)
        return false
      }
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url?.startsWith(baseUrl!)) return url
      return '/resumes'
    }
  },
  pages: {
    signIn: '/',
    signOut: '/'
  }
})