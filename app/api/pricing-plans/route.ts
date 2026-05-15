import { NextResponse } from 'next/server';
import { LANDING_PLANS, mapRemotePlansToLanding, type RemotePlanResponse } from '@/lib/pricing/plans';

export async function GET() {

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch('/backend-api/api/man/plans', {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ source: 'fallback', plans: LANDING_PLANS });
    }

    const remotePlans = (await response.json()) as RemotePlanResponse[];
    const plans = mapRemotePlansToLanding(Array.isArray(remotePlans) ? remotePlans : []);

    return NextResponse.json({ source: 'remote', plans });
  } catch {
    return NextResponse.json({ source: 'fallback', plans: LANDING_PLANS });
  }
}
