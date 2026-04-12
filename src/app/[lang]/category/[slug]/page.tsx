import { prisma } from "@/lib/prisma";
import GameGrid from "@/components/GameGrid";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeonlinegames.us';
const SUPPORTED_LANGS = ['en', 'es', 'fr', 'de', 'pt'];

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const resolvedLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
  
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};

  const title = `${category.name} Games — Play Free Online | Free Games`;
  const description = `Play the best free online ${category.name} games instantly. No downloads, no installs.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${resolvedLang}/category/${slug}`,
      languages: Object.fromEntries(SUPPORTED_LANGS.map(l => [l, `${SITE_URL}/${l}/category/${slug}`])),
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${SITE_URL}/${resolvedLang}/category/${slug}`,
      siteName: 'Free Games',
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { lang, slug } = await params;
  const resolvedLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) {
    return notFound();
  }

  return (
    <div className="min-h-screen">
      <section className="pt-16 pb-8 px-4 text-center">
        <div className="max-w-4xl mx-auto border-b-2 border-white/10 pb-8">
          <h1 className="text-5xl sm:text-7xl font-black mb-4 tracking-tight drop-shadow-md text-white">
             {category.name} Games
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 font-medium leading-relaxed">
            Discover and play the best free {category.name.toLowerCase()} games online!
          </p>
        </div>
      </section>

      <main className="max-w-[1600px] mx-auto px-4 pb-20">
        <GameGrid lang={resolvedLang} categorySlug={slug} />
      </main>
    </div>
  );
}
