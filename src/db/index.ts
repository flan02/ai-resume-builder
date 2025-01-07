import { PrismaClient } from '@prisma/client'

// $ Singleton Pattern
// * This configuration is to avoid creating multiple instances of the prisma client while server is running.

declare global {
  var cachedPrisma: PrismaClient
}

let prisma: PrismaClient
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient() // ? at production we don't need to cache the prisma client because the server will be running only once.
} else {
  if (!global.cachedPrisma) { // ? if the prisma client is not cached, we create a new instance and cache it.
    global.cachedPrisma = new PrismaClient()
    // middleware
    import('../middleware/prisma')
  }
  prisma = global.cachedPrisma // ? if the prisma client is cached, we use the cached instance.
}

export const db = prisma // ? we export the prisma client instance enabling their use in any part of our app.