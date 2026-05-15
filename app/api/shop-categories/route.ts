import { NextResponse } from "next/server";

export async function GET(request: Request) {
    if (!process.env.API_HOST) {
        return NextResponse.json({ source: 'fallback', categories: [] });
    }

    const origin = new URL(request.url).origin;
    const proxyUrl = `${origin}/backend-api/api/store_categories`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers,
          cache: 'no-store',
        });

        if (!response.ok) {
          return NextResponse.json({ source: 'fallback', categories: [] });
        }

        const data = (await response.json()) as { store_categories?: unknown[] };
        const categories = Array.isArray(data.store_categories) ? data.store_categories : [];

        return NextResponse.json({ source: 'remote', categories });
      } catch {
        return NextResponse.json({ source: 'fallback', categories: [] });
      }
}