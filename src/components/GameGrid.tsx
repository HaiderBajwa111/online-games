'use client';

import { Game } from '@/types/game';
import GameCard from './GameCard';
import { useEffect, useState } from 'react';

interface GameGridProps {
  lang?: string;
  categorySlug?: string;
}

export default function GameGrid({ lang = 'en', categorySlug }: GameGridProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const fetchUrl = categorySlug ? `/api/games?categorySlug=${encodeURIComponent(categorySlug)}` : '/api/games';
        const response = await fetch(fetchUrl);
        const data = await response.json();

        if (Array.isArray(data)) {
          setGames(data);
        } else {
          console.error('API did not return an array:', data);
          setGames([]);
          setError('Failed to load games data');
        }
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to fetch games from the server');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 grid-auto-flow-dense">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`bg-slate-800/40 rounded-[2rem] sm:rounded-[3rem] animate-pulse ${i % 7 === 0 ? 'col-span-2 row-span-2' :
              i % 5 === 0 ? 'col-span-2 row-span-1' : ''
              } aspect-square`}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-slate-900/40 backdrop-blur-md rounded-3xl bubble-shadow border border-white/10 max-w-lg mx-auto">
        <p className="text-red-400 font-medium mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 grid-auto-flow-dense">
      {Array.isArray(games) && games.map((game, index) => {
        let spanClass = "";
        if (index === 0 || index % 11 === 0) {
          spanClass = "col-span-2 row-span-2";
        } else if (index % 5 === 0) {
          spanClass = "col-span-2 row-span-1";
        }

        return (
          <GameCard
            key={game.id}
            game={game}
            lang={lang}
            className={spanClass}
          />
        );
      })}
    </div>
  );
}
