'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-cyan-400 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">🎮 Poki</span>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors ${
                isActive('/') ? 'text-white font-semibold' : 'text-white hover:text-gray-200'
              }`}
            >
              Home
            </Link>
            <Link
              href="/admin"
              className={`transition-colors ${
                isActive('/admin') ? 'text-white font-semibold' : 'text-white hover:text-gray-200'
              }`}
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
