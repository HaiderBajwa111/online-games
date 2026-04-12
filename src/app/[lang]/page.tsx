import GameGrid from "@/components/GameGrid";
import { prisma } from "@/lib/prisma";
import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeonlinegames.us';
const SUPPORTED_LANGS = ['en', 'es', 'fr', 'de', 'pt'];

const LANG_META: Record<string, { title: string; description: string }> = {
  en: { title: 'Free Games — Play Free Online Games', description: 'Play the best free online games instantly. No downloads, no installs. Action, puzzles, racing and more.' },
  es: { title: 'Juegos Gratis — Juega Juegos Online Gratis', description: 'Juega los mejores juegos en línea gratis al instante. Sin descargas. Acción, puzzles, carreras y más.' },
  fr: { title: 'Jeux Gratuits — Jouez en Ligne Gratuitement', description: 'Jouez aux meilleurs jeux en ligne gratuitement. Sans téléchargement. Action, puzzles, course et plus.' },
  de: { title: 'Kostenlose Spiele — Online Spiele Kostenlos', description: 'Spiele die besten kostenlosen Online-Spiele sofort. Kein Download. Action, Rätsel, Rennen und mehr.' },
  pt: { title: 'Jogos Grátis — Jogue Jogos Online Grátis', description: 'Jogue os melhores jogos online grátis instantaneamente. Sem downloads. Ação, puzzles, corridas e mais.' },
};

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const resolvedLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
  const meta = LANG_META[resolvedLang];

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${resolvedLang}`,
      languages: Object.fromEntries(SUPPORTED_LANGS.map(l => [l, `${SITE_URL}/${l}`])),
    },
    openGraph: {
      type: 'website',
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${resolvedLang}`,
      siteName: 'Free Games',
    },
  };
}

export default async function LocalizedHome({ params }: Props) {
  const { lang } = await params;
  const resolvedLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const GRADIENTS = [
    'bg-gradient-to-r from-pink-500 to-rose-400',
    'bg-gradient-to-r from-cyan-400 to-blue-500',
    'bg-gradient-to-r from-purple-500 to-indigo-500',
    'bg-gradient-to-r from-emerald-400 to-teal-500',
    'bg-gradient-to-r from-amber-400 to-orange-500',
  ];

  return (
    <div className="min-h-screen">
      <main className="max-w-[1600px] mx-auto px-4 pt-6 pb-20">
        
        {/* Category Quick Links */}
        {categories.length > 0 && (
          <div className="mb-8 overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex flex-nowrap justify-start sm:justify-center gap-3 w-max mx-auto px-2">
              <a href={`/${resolvedLang}/categories`} className="whitespace-nowrap px-6 py-2.5 rounded-full font-black text-white shadow-lg bg-slate-800 hover:bg-slate-700 hover:scale-105 transition-all border border-white/10 uppercase text-sm tracking-wider">
                All
              </a>
              {categories.map((c, i) => (
                <a 
                  key={c.id} 
                  href={`/${resolvedLang}/category/${c.slug}`}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-white shadow-lg shadow-black/20 hover:scale-105 hover:-translate-y-1 transition-all border border-white/10 ${GRADIENTS[i % GRADIENTS.length]}`}
                >
                  {c.name}
                </a>
              ))}
            </div>
          </div>
        )}

        <GameGrid lang={resolvedLang} />
      </main>

      <section className="py-24 px-4 bg-slate-950/40 backdrop-blur-3xl border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-12 text-white tracking-tight">Why Gamers Love Free Games?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-8 bg-indigo-900/20 rounded-[2.5rem] bubble-shadow border border-white/5 hover:bg-indigo-900/30 transition-colors">
              <span className="text-5xl mb-6 block">🚀</span>
              <h3 className="font-bold text-xl mb-3 text-cyan-300">Instant Play</h3>
              <p className="text-slate-400 text-sm leading-relaxed">No installs. No waiting. Just one click to start your adventure in high-definition.</p>
            </div>
            <div className="p-8 bg-purple-900/20 rounded-[2.5rem] bubble-shadow border border-white/5 hover:bg-purple-900/30 transition-colors">
              <span className="text-5xl mb-6 block">🌈</span>
              <h3 className="font-bold text-xl mb-3 text-purple-300">Infinite Variety</h3>
              <p className="text-slate-400 text-sm leading-relaxed">From brain-teasing puzzles to epic action, we have thousands of games for every taste.</p>
            </div>
            <div className="p-8 bg-slate-900/30 rounded-[2.5rem] bubble-shadow border border-white/5 hover:bg-slate-900/40 transition-colors">
              <span className="text-5xl mb-6 block">📱</span>
              <h3 className="font-bold text-xl mb-3 text-indigo-300">Play Anywhere</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Experience seamless gaming on your phone, tablet, or desktop with our optimized platform.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
