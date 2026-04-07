const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const games = await prisma.game.findMany({ orderBy: { createdAt: 'desc' } });
  console.log('Games in DB:\n', JSON.stringify(games, null, 2));
  const admins = await prisma.admin.findMany();
  console.log('Admins in DB:\n', JSON.stringify(admins, null, 2));
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
