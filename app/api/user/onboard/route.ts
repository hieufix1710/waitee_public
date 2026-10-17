import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const signupApiSchema = z
  .object({
    user: z.object({
      email: z.string().email(),
      password: z.string().min(6).optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
    }),
    shop: z
      .object({
        name: z.string().min(1),
        address: z.string().min(1),
        categoryId: z.string().min(1),
        customCategory: z.string().optional(),
      })
      .optional(),
    tenantName: z.string().min(2).optional(),
    planId: z.union([z.number(), z.string()]).optional(),
    ref: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.shop && data.shop.categoryId === '-1') {
        return !!data.shop.customCategory?.trim();
      }
      return true;
    },
    {
      message: 'Custom category is required when "Other" is selected',
      path: ['shop', 'customCategory'],
    },
  );

function generatePassword(): string {
  return randomBytes(12).toString('base64url');
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }

  const parseResult = signupApiSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: 'Dữ liệu không hợp lệ', errors: parseResult.error.flatten() },
      { status: 400 },
    );
  }

  const origin = new URL(request.url).origin;
  const proxyUrl = `${origin}/backend-api/api/user/onboard`;

  const payload: Record<string, unknown> = {};

  const userPayload: Record<string, unknown> = {
    email: parseResult.data.user.email,
    password: parseResult.data.user.password || generatePassword(),
  };
  if (parseResult.data.user.firstName) userPayload.first_name = parseResult.data.user.firstName;
  if (parseResult.data.user.lastName) userPayload.last_name = parseResult.data.user.lastName;
  if (parseResult.data.user.phone) userPayload.phone = parseResult.data.user.phone;
  payload.user = userPayload;

  if (parseResult.data.shop) {
    const shopPayload: Record<string, unknown> = {
      name: parseResult.data.shop.name,
      full_address: parseResult.data.shop.address,
      category_id: parseResult.data.shop.categoryId,
    };
    if (parseResult.data.shop.customCategory) {
      shopPayload.customCategory = parseResult.data.shop.customCategory;
    }
    payload.shop = shopPayload;
  }

  if (parseResult.data.tenantName) {
    payload.tenant_name = parseResult.data.tenantName;
  }

  if (parseResult.data.planId !== undefined) {
    payload.plan_id = parseResult.data.planId;
  }

  if (parseResult.data.ref) {
    payload.ref = parseResult.data.ref;
  }

  // Forward the caller's auth (if any) so an already-signed-in merchant can
  // reuse their account to add a shop instead of creating a duplicate. Public
  // (unauthenticated) sign-ups are unaffected.
  const forwardedHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
  const waitToken = request.headers.get('x-waitee-token');
  if (waitToken) forwardedHeaders['X-Waitee-Token'] = waitToken;
  const authorization = request.headers.get('authorization');
  if (authorization) forwardedHeaders['Authorization'] = authorization;

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: forwardedHeaders,
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
