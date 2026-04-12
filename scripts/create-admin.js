const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
    const prisma = new PrismaClient();
    const email = 'admin@example.com';
    const password = 'adminpassword'; // User should change this later

    console.log(`Creating admin account for ${email}...`);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const admin = await prisma.admin.upsert({
            where: { email },
            update: { hashedPassword },
            create: {
                email,
                hashedPassword,
            },
        });
        console.log('Admin account created/updated successfully:', admin.email);
    } catch (error) {
        console.error('Error creating admin account:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
