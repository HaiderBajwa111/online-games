const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme';
  const hashed = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { hashedPassword: hashed },
    create: { email, hashedPassword: hashed },
  });

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
