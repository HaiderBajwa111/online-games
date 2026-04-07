import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { autoTranslateGame } from '@/lib/translate';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

export async function GET() {
  try {
    const games = await prisma.game.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin token (server runtime)
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.name || !body.description || !body.iframeUrl || !body.image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Allow providing a slug; otherwise generate from name
    let slug = body.slug && String(body.slug).trim();
    if (!slug) {
      slug = String(body.name)
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    } else {
      slug = slug.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    }

    const exists = await prisma.game.findUnique({ where: { slug } });
    if (exists) return NextResponse.json({ error: 'Game with this name already exists' }, { status: 409 });

    const created = await prisma.game.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        image: body.image,
        iframeUrl: body.iframeUrl,
        category: body.category || 'Other',
        rating: body.rating ? Number(body.rating) : undefined,
        metaTitle: body.meta?.title,
        metaDescription: body.meta?.description,
        metaKeywords: body.meta?.keywords,
        metaOgTitle: body.meta?.ogTitle,
        metaOgDescription: body.meta?.ogDescription,
        imageAltText: body.imageAltText,
      },
    });

    // Start automated background translations without heavily blocking the initial HTTP response
    autoTranslateGame(created).catch(console.error);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}
