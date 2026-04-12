import { Game } from '@/types/game';

export const gamesData: Game[] = [
  {
    id: '1',
    name: 'Ludo Hero',
    slug: 'ludo-hero',
    description:
      'Ludo Hero is the best multiplayer board game where you play with more than two players online on Free Games. This is the best classic game because the origin from the German board game, In this game, you will see a different game with few colours. There are different pieces and challenges where you have to play with your friends and opponents. You will enjoy this game by inviting your friends from all over the world. Each player has one color to play at one time. You will win when all your pieces enter into the passage and then first house.',
    image: '/images/placeholder.svg',
    iframeUrl: 'https://html5.poki.com/en/g/ludo-hero/',
    categoryId: 1,
    category: { id: 1, name: 'Board Games', slug: 'board-games' },
    rating: 4.5,
    meta: {
      title: 'Ludo Hero - Play Free Online | Free Games',
      description:
        'Play Ludo Hero for free online. Classic multiplayer board game with friends. No download required!',
      keywords: 'ludo, board game, multiplayer, online',
      ogTitle: 'Ludo Hero',
      ogDescription: 'Play Ludo Hero online with friends',
    },
    createdAt: '2026-03-23T00:00:00.000Z',
    updatedAt: '2026-03-23T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Stickman War',
    slug: 'stickman-war',
    description: 'An action-packed stickman fighting game with intense battles.',
    image: '/images/placeholder.svg',
    iframeUrl: 'https://html5.poki.com/en/g/stickman-war/',
    categoryId: 2,
    category: { id: 2, name: 'Action', slug: 'action' },
    rating: 4.2,
    meta: {
      title: 'Stickman War - Play Free Online | Free Games',
      description: 'Play Stickman War online. Engage in epic stickman battles!',
      keywords: 'stickman, war, action, combat',
      ogTitle: 'Subway Surfers',
      ogDescription: 'Play Subway Surfers online',
    },
    createdAt: '2026-03-23T00:00:00.000Z',
    updatedAt: '2026-03-23T00:00:00.000Z',
  },
];
