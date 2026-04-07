'use client';

import { Game } from '@/types/game';
import Link from 'next/link';
import Image from 'next/image';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/en/game/${game.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border border-gray-100 flex flex-col h-full transform hover:-translate-y-1 duration-200">
        <div className="relative w-full h-48 bg-gray-200">
          <Image
            src={game.image}
            alt={game.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {game.name}
          </h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {game.category}
          </p>
        </div>
      </div>
    </Link>
  );
}
