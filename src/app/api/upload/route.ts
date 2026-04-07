import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, data } = body;
    if (!filename || !data) return NextResponse.json({ error: 'Missing' }, { status: 400 });

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // determine extension
    const ext = path.extname(filename) || '.png';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    const filePath = path.join(uploadsDir, name);

    // data expected as base64 without data:* prefix
    const buffer = Buffer.from(data, 'base64');
    await fs.writeFile(filePath, buffer);

    const publicPath = `/uploads/${name}`;
    return NextResponse.json({ path: publicPath });
  } catch (err) {
    console.error('upload error', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
