# Project Context — Online Games Platform

> Paste this file content at the start of any new chat to give Claude full context.
> Update this file whenever a new feature is added.

---

## What This Is

A free online games website built with Next.js 16 + React 19. The admin adds games (name, iframe URL, image, description, SEO meta), and users play them instantly in-browser — no downloads.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.1 (App Router, React 19) |
| Database | PostgreSQL via Prisma ORM v6 |
| Auth | JWT in HTTP-only cookies (`jsonwebtoken` + `bcryptjs`) |
| Styling | Tailwind CSS v4 |
| Rich Text Editor | `react-quill-new` |
| Auto Translation | `google-translate-api-x` |
| Image Upload | Base64 → saved to `public/uploads/` |

---

## File Structure

```
src/
├── app/
│   ├── page.tsx                        # Homepage (hero + game grid)
│   ├── layout.tsx                      # Root layout (Header + Footer)
│   ├── globals.css
│   ├── game/[slug]/page.tsx            # Legacy redirect → /en/game/[slug]
│   ├── [lang]/game/[slug]/page.tsx     # Game detail page (i18n)
│   ├── admin/
│   │   ├── page.tsx                    # Admin dashboard (list, edit, delete games)
│   │   ├── add/page.tsx                # Add new game form
│   │   ├── login/page.tsx              # Admin login
│   │   └── styles/modal.css
│   └── api/
│       ├── games/route.ts              # GET all, POST create
│       ├── games/[slug]/route.ts       # GET one, PUT update, DELETE
│       ├── auth/login/route.ts
│       ├── auth/logout/route.ts
│       └── upload/route.ts             # Base64 image upload
├── components/
│   ├── Header.tsx                      # Sticky cyan header
│   ├── Footer.tsx
│   ├── GameGrid.tsx                    # Client component, fetches + renders game cards
│   ├── GameCard.tsx                    # Image bubble card → /en/game/[slug]
│   ├── GameIframe.tsx                  # Iframe wrapper for game embed
│   ├── AdminLayout.tsx                 # Wrapper for admin pages
│   ├── KeywordInput.tsx                # Tag-style keyword input
│   ├── LanguageSelector.tsx            # Language switcher on game pages
│   └── CleanupInjectedAttributes.tsx
├── lib/
│   ├── prisma.ts                       # Prisma client singleton
│   └── translate.ts                    # autoTranslateGame() — background i18n
├── data/games.ts                       # (legacy static data, mostly unused)
├── middleware.ts                        # Protects /admin/* routes
└── types/game.ts                       # Game TypeScript type
prisma/
└── schema.prisma                       # DB schema
scripts/
└── create-admin.js                     # One-time script to seed an admin user
```

---

## Database Models

```prisma
model Game {
  id               Int      @id @default(autoincrement())
  name             String
  slug             String   @unique
  description      String   // HTML (from rich text editor)
  image            String   // URL or /uploads/... path
  iframeUrl        String
  category         String
  rating           Float?
  metaTitle        String?
  metaDescription  String?
  metaKeywords     String?
  metaOgTitle      String?
  metaOgDescription String?
  imageAltText     String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  translations     GameTranslation[]
}

model GameTranslation {
  id              Int    @id @default(autoincrement())
  gameId          Int
  language        String   // "es" | "fr" | "de" | "pt"
  name            String
  description     String
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?
  @@unique([gameId, language])
}

model Admin {
  id             Int      @id @default(autoincrement())
  email          String   @unique
  hashedPassword String
}
```

---

## Key Behaviors

### Auth
- Login sets a JWT cookie (`token`)
- Middleware (`src/middleware.ts`) redirects unauthenticated requests away from `/admin/*`
- API routes (`POST`, `PUT`, `DELETE`) do full `jwt.verify()` server-side

### Adding a Game
1. Admin fills form at `/admin/add` — name, slug (optional, auto-generated), description (rich text), image (URL or file upload), iframe URL, category, SEO meta fields
2. POST to `/api/games` creates the DB record
3. `autoTranslateGame()` fires in background — translates name, description, meta into es/fr/de/pt and saves `GameTranslation` rows

### Game Pages
- URL: `/[lang]/game/[slug]` (supported langs: `en`, `es`, `fr`, `de`, `pt`)
- Page merges translation fields on top of base English content
- Renders iframe embed, star rating, rich-text description, "New Games" sidebar
- Full SEO metadata via `generateMetadata()` with hreflang alternates

### Homepage
- `GameGrid` fetches `/api/games`, renders a masonry bubble grid
- Cards are variable size (col-span-2 / row-span-2 for featured games)
- Clicking a card goes to `/en/game/[slug]`

---

## Environment Variables

```env
DATABASE_URL=       # PostgreSQL connection string
JWT_SECRET=         # Secret for signing JWT tokens
```

---

## NPM Scripts

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run prisma:migrate # Push schema changes (prisma db push)
npm run seed          # Seed initial data
node scripts/create-admin.js  # Create admin user
```

---

## Features Log

| Date | Feature |
|---|---|
| Initial | Game CRUD (add, edit, delete) via admin panel |
| Initial | iframe embed player on game detail page |
| Initial | Image upload (base64 → public/uploads/) |
| Initial | Auto i18n — es, fr, de, pt via Google Translate on save |
| Initial | SEO meta fields (title, description, keywords, OG) per game |
| Initial | JWT-based admin auth with middleware protection |
| Initial | Masonry bubble-style game grid on homepage |
| Initial | Language selector on game pages |
| 2026-04-10 | Moved language selector to header (site-wide), `/` redirects to `/en`, homepage available at `/[lang]` |
| 2026-04-10 | SEO: sitemap.xml (all games × 5 langs), robots.txt, JSON-LD VideoGame schema, canonical URLs, HTML-stripped meta descriptions, noindex on admin, per-lang homepage metadata |
| Initial | "New Games" sidebar on game detail page |
