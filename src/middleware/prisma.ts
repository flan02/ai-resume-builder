/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Middleware para eliminar campos nulos o indefinidos. Evitando asi que vayan como dato NULL a mongodb.
prisma.$use(async (params: any, next) => {
  if (params.action === 'create' || params.action === 'update') {
    params.args.data = Object.fromEntries(
      Object.entries(params.args.data).filter(([_, v]) => v != null)
    );
  }
  return next(params);
});

export default prisma;








