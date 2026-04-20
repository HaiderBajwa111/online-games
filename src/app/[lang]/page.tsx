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

      {/* SEO Content Section */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-slate-300 space-y-14 text-base leading-relaxed">

          {/* Intro */}
          <div>
            <h2 className="text-3xl font-black text-white mb-4">FreeOnlineGames – Play Free Online Games Instantly on FreeOnlineGames.us</h2>
            <p className="text-slate-400">If you are looking for the best FreeOnlineGames, then you are already in the right place. At freeonlinegames.us, we keep things simple. You open a game, and you start playing.</p>
            <p className="text-slate-400 mt-3">No downloads. No waiting. No confusion.</p>
            <p className="text-slate-400 mt-3">We know many players come from platforms like poki games or crazy games, searching for something quick and fun. And honestly, that's exactly what we offer here too—but in a cleaner and easier way.</p>
          </div>

          {/* What You Can Do */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">What You Can Do on FreeOnlineGames.us</h2>
            <p className="text-slate-400 mb-4">At freeonlinegames.us, you can play hundreds of free online games directly in your browser. No setup needed.</p>
            <p className="text-slate-400 mb-2">You will find:</p>
            <ul className="list-disc list-inside text-slate-400 space-y-1 ml-2">
              <li>Action games</li>
              <li>Racing games</li>
              <li>Puzzle games</li>
              <li>Arcade games</li>
              <li>Multiplayer games</li>
            </ul>
            <p className="text-slate-400 mt-4">Some games are very simple. Some are a bit challenging. But all of them are easy to start. And that matters more than people think.</p>
          </div>

          {/* Why Players Choose */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Why Players Choose FreeOnlineGames.us</h2>
            <p className="text-slate-400 mb-6">There are many sites like poki.com games or crazy games, but players stay here for a reason.</p>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-1">Instant Play</h3>
                <p className="text-slate-400">Every game works instantly. Just like poki games online free, you don't need to download anything. Click → Play → Done.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-1">Clean and Easy Experience</h3>
                <p className="text-slate-400">Some websites feel messy. Too many ads. Too many clicks. We avoid that. We keep the experience smooth, just like poki free online games, but more focused.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-1">Works on Any Device</h3>
                <p className="text-slate-400 mb-2">You can play on:</p>
                <ul className="list-disc list-inside text-slate-400 space-y-1 ml-2">
                  <li>Mobile</li>
                  <li>Laptop</li>
                  <li>Desktop</li>
                </ul>
                <p className="text-slate-400 mt-2">Even if your device is not very strong, games still run well.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-1">Unblocked Style Access</h3>
                <p className="text-slate-400 mb-2">Many users search for poki unblocked or crazy games unblocked because they want to play in school or restricted networks. We understand that. That's why many games here work without problems.</p>
              </div>
            </div>
          </div>

          {/* Popular Games */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Popular Games You Can Play</h2>
            <p className="text-slate-400 mb-6">We offer games that people already love from platforms like poki games free online and free crazy games.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-900/40 rounded-2xl border border-white/5">
                <h3 className="font-bold text-purple-300 mb-2">Casual Favorites</h3>
                <p className="text-slate-500 text-sm mb-2">Simple but addictive:</p>
                <ul className="list-disc list-inside text-slate-400 text-sm space-y-1 ml-1">
                  <li>Eggy Car</li>
                  <li>Planet Clicker</li>
                  <li>Idle Clicker Games</li>
                </ul>
                <p className="text-slate-500 text-sm mt-2">You start for a minute… and keep playing longer.</p>
              </div>
              <div className="p-5 bg-slate-900/40 rounded-2xl border border-white/5">
                <h3 className="font-bold text-purple-300 mb-2">Skill-Based Games</h3>
                <p className="text-slate-500 text-sm mb-2">Need timing and focus:</p>
                <ul className="list-disc list-inside text-slate-400 text-sm space-y-1 ml-1">
                  <li>Tap Tap Shots</li>
                  <li>Electron Dash</li>
                  <li>Sky Riders</li>
                </ul>
                <p className="text-slate-500 text-sm mt-2">These feel easy at first. Then they get tricky.</p>
              </div>
              <div className="p-5 bg-slate-900/40 rounded-2xl border border-white/5">
                <h3 className="font-bold text-purple-300 mb-2">Multiplayer Games</h3>
                <p className="text-slate-500 text-sm mb-2">Play with others:</p>
                <ul className="list-disc list-inside text-slate-400 text-sm space-y-1 ml-1">
                  <li>BuildNow GG</li>
                  <li>1v1 Unblocked</li>
                  <li>Snowball.io</li>
                </ul>
                <p className="text-slate-500 text-sm mt-2">This is where things get competitive.</p>
              </div>
              <div className="p-5 bg-slate-900/40 rounded-2xl border border-white/5">
                <h3 className="font-bold text-purple-300 mb-2">Sports Games</h3>
                <p className="text-slate-500 text-sm mb-2">Quick fun:</p>
                <ul className="list-disc list-inside text-slate-400 text-sm space-y-1 ml-1">
                  <li>Basketball Bros</li>
                  <li>Basketball Legends 2020</li>
                  <li>Ping Pong Game</li>
                </ul>
                <p className="text-slate-500 text-sm mt-2">Short matches. Easy to enjoy.</p>
              </div>
            </div>
          </div>

          {/* Types of Games */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Types of Free Online Games Available</h2>
            <p className="text-slate-400 mb-4">We don't just copy games on poki.com. We organize them better.</p>
            <div className="space-y-3">
              {[
                { title: 'Arcade Games', desc: 'Fast, simple, and fun.' },
                { title: 'Clicker Games', desc: 'Tap and upgrade. Very relaxing.' },
                { title: 'Racing Games', desc: 'Examples include drift boss game and mr racer. Speed and control matter here.' },
                { title: 'Puzzle Games', desc: 'Think and solve: math duck, guess who game.' },
                { title: 'Adventure Games', desc: 'Explore and enjoy: paper minecraft, dinosaur games.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-3 items-start">
                  <span className="mt-1 w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                  <div><span className="text-white font-semibold">{title}: </span><span className="text-slate-400">{desc}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Better Than Poki */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Better Than Typical Poki Games Experience?</h2>
            <p className="text-slate-400 mb-3">Let's be honest for a second. Platforms like poki.com free online games are popular because they are simple. But sometimes they feel crowded.</p>
            <p className="text-slate-400 mb-2">At freeonlinegames.us, we focus on:</p>
            <ul className="list-disc list-inside text-slate-400 space-y-1 ml-2">
              <li>Faster loading</li>
              <li>Cleaner layout</li>
              <li>Less distraction</li>
            </ul>
            <p className="text-slate-400 mt-3">So you spend more time playing, not searching.</p>
          </div>

          {/* How to Start */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">How to Start Playing</h2>
            <p className="text-slate-400 mb-3">We keep it very simple:</p>
            <ol className="list-decimal list-inside text-slate-400 space-y-1 ml-2">
              <li>Visit freeonlinegames.us</li>
              <li>Choose any game</li>
              <li>Click and play</li>
            </ol>
            <p className="text-slate-400 mt-3">No account. No login.</p>
          </div>

          {/* Safety & Growth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900/40 rounded-2xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-3">Are FreeOnlineGames Safe?</h3>
              <p className="text-slate-400 text-sm mb-2">Yes, if you use the right platform. We make sure:</p>
              <ul className="list-disc list-inside text-slate-400 text-sm space-y-1 ml-1">
                <li>Games run in browser</li>
                <li>No downloads needed</li>
                <li>No risky files</li>
              </ul>
              <p className="text-slate-400 text-sm mt-2">Just like trusted sites such as poki games online, but safer and cleaner.</p>
            </div>
            <div className="p-5 bg-slate-900/40 rounded-2xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-3">Why Simple Games Win in 2026</h3>
              <p className="text-slate-400 text-sm mb-2">Big games look impressive. But simple games win. Because people don't always have time. They want:</p>
              <ul className="list-disc list-inside text-slate-400 text-sm space-y-1 ml-1">
                <li>Quick fun</li>
                <li>Easy controls</li>
                <li>No learning curve</li>
              </ul>
              <p className="text-slate-400 text-sm mt-2">That's why FreeOnlineGames continue to grow faster than heavy games.</p>
            </div>
          </div>

          {/* Daily Habits */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Daily Gaming Habits of Players</h2>
            <p className="text-slate-400 mb-2">Most players don't sit for hours. They:</p>
            <ul className="list-disc list-inside text-slate-400 space-y-1 ml-2">
              <li>Play during breaks</li>
              <li>Play before sleep</li>
              <li>Play between tasks</li>
            </ul>
            <p className="text-slate-400 mt-3">That's why short games like idle clicker games or planet clicker are so popular. They fit into real life.</p>
          </div>

          {/* Future */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Future of FreeOnlineGames.us</h2>
            <p className="text-slate-400">We plan to keep improving. More games. Better speed. Cleaner design. We want this platform to feel better than poki games online free — not by copying them, but by making things simpler.</p>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions (FAQ)</h2>
            <div className="space-y-4">
              {[
                { q: 'What is FreeOnlineGames.us?', a: 'It is a platform where you can play FreeOnlineGames instantly in your browser.' },
                { q: 'Do I need to download anything?', a: 'No. All games work online, just like poki free games.' },
                { q: 'Are the games free?', a: 'Yes. Every game on the site is free.' },
                { q: 'Can I play on mobile?', a: 'Yes. Our games work on mobile, just like poki games online free.' },
                { q: 'Are these games safe?', a: 'Yes. We keep everything browser-based and simple.' },
                { q: 'Do you have unblocked games?', a: 'Yes. Many games work like poki unblocked and crazy games unblocked versions.' },
                { q: 'What are the most popular games?', a: 'Games like Eggy Car, Basketball Bros, and Drift Boss Game are very popular.' },
              ].map(({ q, a }) => (
                <div key={q} className="border-b border-white/5 pb-4">
                  <p className="font-semibold text-white mb-1">{q}</p>
                  <p className="text-slate-400 text-sm">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Thoughts */}
          <div className="p-6 bg-indigo-900/20 rounded-2xl border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-3">Final Thoughts</h2>
            <p className="text-slate-400 mb-3">At the end of the day, FreeOnlineGames should be simple. That's what we focus on at freeonlinegames.us.</p>
            <p className="text-slate-400 mb-3">No downloads. No confusion. Just games.</p>
            <p className="text-slate-400">You can explore like you would on poki.com games or free crazy games, but with a cleaner and faster experience. So don't overthink it. Pick a game. Start playing. And enjoy the moment. 🎮</p>
          </div>

        </div>
      </section>
    </div>
  );
}
