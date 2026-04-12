import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { autoTranslateGame } from '@/lib/translate';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

type Params = { slug: string };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const game = await prisma.game.findUnique({ where: { slug } });

  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  return NextResponse.json(game);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try { jwt.verify(token, JWT_SECRET); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

    const { slug: id } = await params;
    const deleted = await prisma.game.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true, deleted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try { jwt.verify(token, JWT_SECRET); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

    const { slug: id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID is required for updating the game' }, { status: 400 });
    }

    const gameId = parseInt(id, 10);
    if (isNaN(gameId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();

    const data: any = {};
    if (body.name) data.name = body.name;
    if (body.slug) data.slug = body.slug; // Allow updating slug
    if (body.description) data.description = body.description;
    if (body.image) data.image = body.image;
    if (body.iframeUrl) data.iframeUrl = body.iframeUrl;
    if (body.categoryId) data.categoryId = parseInt(body.categoryId, 10);
    if (body.rating !== undefined) data.rating = Number(body.rating);
    if (body.meta) {
      data.metaTitle = body.meta.title;
      data.metaDescription = body.meta.description;
      data.metaKeywords = body.meta.keywords;
      data.metaOgTitle = body.meta.ogTitle;
      if (body.meta?.ogDescription !== undefined) data.metaOgDescription = body.meta.ogDescription;
      if (body.imageAltText !== undefined) data.imageAltText = body.imageAltText;
    }

    const updated = await prisma.game.update({ where: { id: Number(id) }, data });

    // Trigger automated background translation resyncs when game properties modify
    autoTranslateGame(updated).catch(console.error);

    return NextResponse.json(updated);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Update failed', details: errorMessage }, { status: 500 });
  }
}
