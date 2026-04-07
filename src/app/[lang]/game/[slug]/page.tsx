import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import GameIframe from '@/components/GameIframe';
import LanguageSelector from '@/components/LanguageSelector';

interface GamePageProps {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const game = await prisma.game.findUnique({
    where: { slug },
    include: { translations: true }
  });
  if (!game) return {};

  const t = game.translations.find(tr => tr.language === lang);

  return {
    title: t?.metaTitle || game.metaTitle || game.name,
    description: t?.metaDescription || game.metaDescription || game.description,
    keywords: t?.metaKeywords || game.metaKeywords || '',
    alternates: {
      languages: {
        'en': `/en/game/${game.slug}`,
        'es': `/es/game/${game.slug}`,
        'fr': `/fr/game/${game.slug}`,
        'de': `/de/game/${game.slug}`,
        'pt': `/pt/game/${game.slug}`,
      },
    },
    openGraph: {
      title: t?.metaTitle || game.metaOgTitle || game.metaTitle || game.name,
      description: t?.metaDescription || game.metaOgDescription || game.metaDescription || game.description,
      images: [game.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: game.metaOgTitle || game.metaTitle || game.name,
      description: game.metaOgDescription || game.metaDescription || game.description,
      images: [game.image],
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug, lang } = await params;
  const baseGame = await prisma.game.findUnique({
    where: { slug },
    include: { translations: true }
  });
  if (!baseGame) return notFound();

  // Extract localization
  const t = baseGame.translations.find(trans => trans.language === lang);

  // Merge layout content
  const game = {
    ...baseGame,
    name: t?.name || baseGame.name,
    description: t?.description || baseGame.description,
  };

  // Fetch newest games for sidebar
  const newGames = await prisma.game.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto py-8 flex flex-col lg:flex-row gap-8 px-4 overflow-x-hidden">
      {/* Left Main Content */}
      <div className="flex-1 min-w-0">

        <LanguageSelector />

        <h1 className="text-4xl font-bold text-gray-900 mb-2">{game.name}</h1>
        {game.rating && (
          <div className="flex items-center text-orange-500 mb-6">
            <span className="text-lg">{'★'.repeat(Math.round(game.rating))}{'☆'.repeat(5 - Math.round(game.rating))}</span>
            <span className="text-gray-600 ml-2 text-sm">{game.rating.toFixed(1)} (5988)</span>
          </div>
        )}
        <div className="mb-4 w-full h-[600px] border-4 border-cyan-500 rounded-xl overflow-hidden shadow-2xl relative bg-black">
          <GameIframe src={game.iframeUrl} title={game.name} image={game.image} />
        </div>
        <div className="text-center text-sm text-gray-500 my-4 mb-8">Ad Powered by Advergic.com</div>
        <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm break-words overflow-hidden">
          <div className="text-gray-700 [&_p]:mb-4 [&_p]:whitespace-normal [&_p]:break-words [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_a]:text-cyan-600 [&_strong]:font-bold leading-relaxed w-full" dangerouslySetInnerHTML={{ __html: game.description }} />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 lg:shrink-0 bg-[#40e0d0] p-6 lg:min-h-screen">
        <h2 className="text-xl font-bold text-gray-900 mb-6">New Games</h2>
        <div className="flex flex-col gap-6">
          {newGames.map(ng => (
            <a key={ng.id} href={`/${lang}/game/${ng.slug}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image src={ng.image} alt={ng.imageAltText || ng.name} fill className="object-cover shadow hover:shadow-md transition-shadow" sizes="64px" />
              </div>
              <span className="font-semibold text-gray-800 text-sm">{ng.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
