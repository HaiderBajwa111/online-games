'use client';

import { usePathname, useRouter } from 'next/navigation';

const LANGS = [
  { code: 'en', label: '🇬🇧 EN' },
  { code: 'es', label: '🇪🇸 ES' },
  { code: 'fr', label: '🇫🇷 FR' },
  { code: 'de', label: '🇩🇪 DE' },
  { code: 'pt', label: '🇧🇷 PT' },
];

export default function LanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split('/').filter(Boolean);
  const currentLang = segments.length > 0 && ['en', 'es', 'fr', 'de', 'pt'].includes(segments[0])
    ? segments[0]
    : 'en';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const parts = pathname.split('/');
    
    if (pathname.startsWith('/admin')) {
      router.push(`/${newLang}`);
      return;
    }
    
    if (parts.length > 1 && ['en', 'es', 'fr', 'de', 'pt'].includes(parts[1])) {
      parts[1] = newLang;
      router.push(parts.join('/'));
    } else {
      router.push(`/${newLang}${pathname === '/' ? '' : pathname}`);
    }
  };

  return (
    <select
      value={currentLang}
      onChange={handleChange}
      className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm rounded-full px-2 sm:px-3 py-1.5 border border-white/30 cursor-pointer outline-none transition-colors backdrop-blur-sm"
    >
      {LANGS.map(l => (
        <option key={l.code} value={l.code} className="bg-violet-700 text-white">
          {l.label}
        </option>
      ))}
    </select>
  );
}
