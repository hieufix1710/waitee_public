import { NextResponse } from 'next/server';

export async function GET() {
  const backendBaseUrl = process.env.API_HOST?.replace(/\/$/, '');

  if (!backendBaseUrl) {
    return NextResponse.json({ error: 'Pricing service is not configured.' }, { status: 503 });
  }

  try {
    const response = await fetch(`${backendBaseUrl}/api/man/plans`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ error: 'Unable to load pricing plans.' }, { status: 502 });
  }
}
