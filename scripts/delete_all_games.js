const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const all = await prisma.game.findMany();
  console.log('Found games:', all.map(g => ({ id: g.id, slug: g.slug, name: g.name })));
  if (all.length === 0) {
    console.log('No games to delete');
    await prisma.$disconnect();
    return;
  }

  await prisma.game.deleteMany();
  console.log('Deleted all games');
  await prisma.$disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
