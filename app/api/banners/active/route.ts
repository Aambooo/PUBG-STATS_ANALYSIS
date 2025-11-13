import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();

    const banners = await prisma.banner.findMany({
      where: {
        startDate: { lte: now },
        endDate:   { gte: now },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    // Just return exactly what’s in the DB – no defaults, no overrides
    return NextResponse.json({
      banners: banners.map((b) => ({
        id: b.id,
        title: b.title,
        imageUrl: b.imageUrl,
        redirectUrl: b.redirectUrl,
        startDate: b.startDate,
        endDate: b.endDate,
        clicks: b.clicks,
      })),
    });
  } catch (error) {
    console.error('Error loading active banners:', error);
    return NextResponse.json({ banners: [], error: 'Failed to load banners' }, { status: 500 });
  }
}
