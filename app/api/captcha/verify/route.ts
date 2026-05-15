import { NextResponse } from 'next/server';

const TURNSTILE_TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

export async function POST(request: Request) {
  // Always return success, as math check is now handled on frontend
  return NextResponse.json({ success: true });
}
