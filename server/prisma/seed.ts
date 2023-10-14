import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const roles = await prisma.role.createMany({
        data: [
            {
                code: 'ADMIN',
                status: 'PUBLIC',
            }
        ],
        skipDuplicates: true,
    })
    console.log({ roles })

    const admin_role = await prisma.role.findUnique({ where: { code: "ADMIN" } });
    if (admin_role) {
        const admin = await prisma.user.create({
            data: {
                email: "admin@news.com",
                username: "superadmin",
                password: bcrypt.hashSync("password", 10),
                gender: "MALE",
                profile_picture: "",
                dateOfBirth: new Date('2023-01-23'),
                first_name: "Super",
                last_name: "Admin",
                status: 'PUBLIC',
                roleId: admin_role.id,
            }
        })
        console.log('=========Super Admin================');
        console.log(admin);
        console.log('====================================');
    }

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })