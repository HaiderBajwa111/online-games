const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const toFix = await prisma.game.findMany({
    where: {
      OR: [
        { image: { contains: 'example.com' } },
        { image: { contains: 'images.poki.com' } },
      ],
    },
  });

  if (toFix.length === 0) {
    console.log('No games found with external images to fix');
    return;
  }

  for (const g of toFix) {
    console.log('Updating game image to local placeholder:', g.id, g.slug, g.image);
    await prisma.game.update({
      where: { id: g.id },
      data: {
        image: '/images/placeholder.svg',
        metaOgImage: '/images/placeholder.svg',
      },
    });
  }

  console.log('Done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
