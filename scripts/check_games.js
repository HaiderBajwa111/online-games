const { PrismaClient } = require('@prisma/client');

(async function main(){
  const p = new PrismaClient();
  try {
    const g = await p.game.findMany();
    console.log('games count:', g.length);
    console.log(JSON.stringify(g, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await p.$disconnect();
  }
})();
