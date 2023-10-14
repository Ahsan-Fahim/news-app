
import { config } from 'dotenv'
import { Server } from './Api/server'
import Logger from './core/Logger';
import { prisma } from "./database"

config();

(async function main(): Promise<void> {
    try {

        await prisma.$connect()

        process.on('uncaughtException', (e) => {
            Logger.error(e);
        });

        // Init express server
        const server = new Server()

        server.listen()

    } catch (err: any) {
        console.log(err);
        Logger.error(err.stack);
    }
})();
