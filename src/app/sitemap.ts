import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeonlinegames.us';
const LANGS = ['en', 'es', 'fr', 'de', 'pt'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await prisma.game.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { createdAt: 'desc' },
  });

  // Homepage per language
  const homeEntries: MetadataRoute.Sitemap = LANGS.map(lang => ({
    url: `${SITE_URL}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: lang === 'en' ? 1.0 : 0.8,
  }));

  // Game pages per language
  const gameEntries: MetadataRoute.Sitemap = games.flatMap(game =>
    LANGS.map(lang => ({
      url: `${SITE_URL}/${lang}/game/${game.slug}`,
      lastModified: game.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: lang === 'en' ? 0.9 : 0.7,
    }))
  );

  return [...homeEntries, ...gameEntries];
}
