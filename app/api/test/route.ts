import { NextResponse } from 'next/server';
import { searchPlayer } from '@/lib/pubg-api';

export async function GET(request: Request) {
  try {
    // Test with a known PUBG player (Shroud)
    const result = await searchPlayer('shroud', 'steam');
    
    return NextResponse.json({
      success: true,
      message: 'PUBG API is working!',
      data: result
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'PUBG API test failed',
      error: error.message
    }, { status: 500 });
  }
}