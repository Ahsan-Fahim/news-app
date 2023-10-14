// import { PrismaClient, Prisma } from '@prisma/client'
import { PrismaClient, Prisma } from '@prisma/client'
export {
    User,
    Role,
    Keystore,
    RoleCode,
    Tokenstore,
    Invoice,
    Currency,
    InvoiceStatus
} from '@prisma/client'
import Logger from '../core/Logger';
import { env, DATABASE, environment } from '../config/globals';

export const prisma = new PrismaClient()
export const IPrisma = Prisma;

// Build the connection string
const enviroment = 'development';
// const dbURI = env.DB[enviroment].uri;
const dbURI = DATABASE[environment];

(async function db() {
    try {
        Logger.info(`Connecting to ${process.env.DATABASE_URL}`);
        await prisma.$connect()
        Logger.info('postgresql connection done');
    } catch (error) {
        Logger.info('postgresql connection error');
        Logger.error(error);
        await prisma.$disconnect()
        process.exit(1)
    }
})()
