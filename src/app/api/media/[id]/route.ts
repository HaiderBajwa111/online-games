import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { jwt.verify(token, JWT_SECRET); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id: Number(id) } });
  if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Delete file from disk
  try {
    const filePath = path.join(process.cwd(), 'public', media.path);
    await fs.unlink(filePath);
  } catch {
    // file may already be gone — continue
  }

  await prisma.media.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { jwt.verify(token, JWT_SECRET); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  const { id } = await params;
  const { altText } = await req.json();
  const media = await prisma.media.update({
    where: { id: Number(id) },
    data: { altText },
  });
  return NextResponse.json(media);
}
