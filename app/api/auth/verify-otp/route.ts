import { NextResponse } from 'next/server';
import { z } from 'zod';

const verifyOtpSchema = z.object({
  identifier: z.string().min(1),
  otp_code: z.string().regex(/^\d{4,8}$/),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }

  const parseResult = verifyOtpSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: 'Dữ liệu không hợp lệ', errors: parseResult.error.flatten() },
      { status: 400 },
    );
  }

  const origin = new URL(request.url).origin;
  const proxyUrl = `${origin}/backend-api/api/auth/verify_otp`;

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parseResult.data),
  });
  const data = await response.json();

  const headers = new Headers({ 'Content-Type': 'application/json' });
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) headers.set('set-cookie', setCookie);

  return new NextResponse(JSON.stringify(data), { status: response.status, headers });
}
