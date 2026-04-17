import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import processEnv from "../../env";
import { PrismaClient } from '../../generated/prisma/client';

const adapter = new PrismaMariaDb({
    host: processEnv.DATABASE_HOST,
    user: processEnv.DATABASE_USER,
    password: processEnv.DATABASE_PASSWORD,
    database: processEnv.DATABASE_NAME,
    connectionLimit: 5
});
const prisma = new PrismaClient({ adapter });

export { prisma }