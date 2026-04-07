'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSelector() {
    const pathname = usePathname();
    const router = useRouter();

    // Calculate current language code from URL routing parameters (e.g., /es/game/jump-only => es)
    const segments = pathname.split('/').filter(Boolean);
    const currentLang = segments.length > 0 && ['en', 'es', 'fr', 'de', 'pt'].includes(segments[0]) ? segments[0] : 'en';

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        const parts = pathname.split('/');
        // Check if the first subpath is a language code; if so, replace it, otherwise inject it
        if (parts.length > 1 && ['en', 'es', 'fr', 'de', 'pt'].includes(parts[1])) {
            parts[1] = newLang;
            router.push(parts.join('/'));
        } else {
            router.push(`/${newLang}${pathname}`);
        }
    };

    return (
        <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <select
                value={currentLang}
                onChange={handleChange}
                className="bg-white border-2 border-cyan-100 text-gray-800 font-medium text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block px-3 py-2 shadow-sm cursor-pointer outline-none hover:bg-gray-50 transition-colors"
            >
                <option value="en">English (Default)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="pt">Português</option>
            </select>
        </div>
    );
}
