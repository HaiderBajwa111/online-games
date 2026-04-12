import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeonlinegames.us';
const SUPPORTED_LANGS = ['en', 'es', 'fr', 'de', 'pt'];

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const resolvedLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';

  const title = `All Game Categories — Free Games`;
  const description = `Browse all our game categories. Play the best free online games instantly.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${resolvedLang}/categories`,
      languages: Object.fromEntries(SUPPORTED_LANGS.map(l => [l, `${SITE_URL}/${l}/categories`])),
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${SITE_URL}/${resolvedLang}/categories`,
      siteName: 'Free Games',
    },
  };
}

// Array of fun gradients to randomly (or pseudo-randomly) assign to category cards
const GRADIENTS = [
  'from-pink-500 to-rose-400',
  'from-cyan-400 to-blue-500',
  'from-purple-500 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-fuchsia-500 to-violet-600',
  'from-lime-400 to-green-500',
];

export default async function CategoriesPage({ params }: Props) {
  const { lang } = await params;
  const resolvedLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';

  // Fetch categories, including the count of games so we can display it!
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { games: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen">
      <section className="pt-16 pb-12 px-4 text-center">
        <div className="max-w-4xl mx-auto border-b-2 border-white/10 pb-12">
          <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight drop-shadow-md text-white">
             Browse Categories
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 font-medium leading-relaxed">
            Find exactly what you want to play... instantly!
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => {
            const gradient = GRADIENTS[index % GRADIENTS.length];
            return (
              <Link 
                key={category.id} 
                href={`/${resolvedLang}/category/${category.slug}`}
                className="group relative overflow-hidden rounded-3xl aspect-[4/3] sm:aspect-square flex flex-col items-center justify-center p-6 text-center bubble-shadow transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                
                {/* Overlay shine/glass effect */}
                <div className="absolute inset-0 bg-white/10 block group-hover:bg-transparent transition-colors"></div>

                <div className="relative z-10 flex flex-col items-center">
                  <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md mb-2 group-hover:scale-110 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <span className="bg-black/20 backdrop-blur-sm text-white/90 text-sm font-bold px-3 py-1 rounded-full border border-white/10 group-hover:bg-black/30 transition-colors">
                    {category._count.games} Games
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
