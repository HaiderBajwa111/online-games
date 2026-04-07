export interface GameMeta {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iframeUrl: string;
  category: string;
  rating?: number;
  meta: GameMeta;
  createdAt: string;
  updatedAt: string;
}
