import { PrismaClient } from '@prisma/client';

const nsql_db: PrismaClient = new PrismaClient({ datasources: { db: { url: process.env.NS_DATABASE_URL } } });
export { nsql_db };
