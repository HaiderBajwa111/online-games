'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSelector from './LanguageSelector';

const SUPPORTED_LANGS = ['en', 'es', 'fr', 'de', 'pt'];

export default function Header() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const currentLang = segments.length > 0 && SUPPORTED_LANGS.includes(segments[0])
    ? segments[0]
    : 'en';

  const isHomePage = pathname === '/' || /^\/(?:en|es|fr|de|pt)\/?$/.test(pathname);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 shadow-lg shadow-fuchsia-500/30 border-b-2 border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${currentLang}`} className="flex items-center space-x-2 group">
            <span className="text-[1.2rem] sm:text-[1.5rem] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] group-hover:scale-105 transition-transform duration-200 whitespace-nowrap">
              🎮 Free Games
            </span>
          </Link>

          <nav className="flex items-center space-x-2">
            <Link
              href={`/${currentLang}`}
              className={`px-2 sm:px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 ${
                isHomePage
                  ? 'bg-white text-fuchsia-600 shadow-md shadow-white/20'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Home
            </Link>
            <Link
              href={`/${currentLang}/categories`}
              className={`px-2 sm:px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 ${
                pathname.includes('/categories') || pathname.includes('/category/')
                  ? 'bg-white text-fuchsia-600 shadow-md shadow-white/20'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Categories
            </Link>
            <LanguageSelector />
          </nav>
        </div>
      </div>
    </header>
  );
}
