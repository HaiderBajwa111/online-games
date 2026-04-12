'use client';

import { Game } from '@/types/game';
import Link from 'next/link';
import Image from 'next/image';

interface GameCardProps {
  game: Game;
  className?: string;
  lang?: string;
}

export default function GameCard({ game, className = "", lang = "en" }: GameCardProps) {
  return (
    <Link
      href={`/${lang}/game/${game.slug}`}
      className={`group relative block overflow-hidden rounded-[2rem] sm:rounded-[3rem] bubble-shadow bubble-glow transition-all duration-500 hover:z-10 hover:scale-105 ${className}`}
    >
      <div className="relative aspect-square w-full h-full bg-slate-900/50">
        <Image
          src={game.image}
          alt={game.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
        />

        {/* Overlay with Title */}
        <div className="absolute inset-0 bg-linear-to-t from-indigo-950/90 via-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
          <h3 className="text-white text-sm sm:text-base font-bold leading-tight transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {game.name}
          </h3>
          <p className="text-cyan-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            {game.category?.name || "Game"}
          </p>
        </div>
      </div>
    </Link>
  );
}
