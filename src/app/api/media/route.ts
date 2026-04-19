import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

function auth(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return false;
  try { jwt.verify(token, JWT_SECRET); return true; } catch { return false; }
}

export async function GET() {
  // prisma client may not have a 'media' property in the generated types; use an any-cast to call dynamically
  const media = await (prisma as any).media.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { filename, data, altText } = await req.json();
  if (!filename || !data) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(filename) || '.png';
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const filePath = path.join(uploadsDir, name);
  const buffer = Buffer.from(data, 'base64');
  await fs.writeFile(filePath, buffer);
  const publicPath = `/uploads/${name}`;
  // prisma client may not have a 'media' property in the generated types; use an any-cast to call dynamically
  const media = await (prisma as any).media.create({
    data: {
      filename: filename,
      path: publicPath,
      altText: altText || null,
      size: buffer.byteLength,
    },
  });

  return NextResponse.json(media, { status: 201 });
}
