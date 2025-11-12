import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
    }

    const banner = await prisma.banner.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error('Error tracking banner click:', error);
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}
