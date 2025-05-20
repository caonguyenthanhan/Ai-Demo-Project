import { NextRequest, NextResponse } from 'next/server';
import downloadAndExtractModels from '@/scripts/download-models';

export async function POST(req: NextRequest) {
  try {
    const result = await downloadAndExtractModels();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in download-models API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to download models' },
      { status: 500 }
    );
  }
} 