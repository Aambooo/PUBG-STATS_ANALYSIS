// app/api/banners/active/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();

    // Fetch only currently active banners
    const banners = await prisma.banner.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { startDate: 'asc' },
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Error fetching active banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}
