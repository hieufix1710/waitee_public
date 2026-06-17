import { NextResponse } from "next/server";
import { z } from 'zod';

const signupApiSchema = z.object({
  user: z.object({
    email: z.string().email(),
    password: z.string().min(6).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
  }),
  shop: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    categoryId: z.string().min(1),
    customCategory: z.string().optional(),
  }).optional(),
  tenantName: z.string().min(2).optional(),
  planId: z.any().optional(),
}).refine((data) => {
  if (data.shop && data.shop.categoryId === '-1') {
    return !!data.shop.customCategory?.trim();
  }
  return true;
}, {
  message: 'Custom category is required when "Other" is selected',
  path: ['shop', 'customCategory'],
});

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = signupApiSchema.safeParse(body);
  if (!parseResult.success) {
    return new NextResponse(JSON.stringify({ message: 'Dữ liệu không hợp lệ', errors: parseResult.error.flatten() }), { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const proxyUrl = `${origin}/backend-api/api/user/onboard`;

  const payload: Record<string, unknown> = {};

  const userPayload: Record<string, unknown> = {
    email: parseResult.data.user.email,
    password: parseResult.data.user.password || Math.random().toString(36).slice(-12),
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
      (shopPayload as Record<string, unknown>).customCategory = parseResult.data.shop.customCategory;
    }
    payload.shop = shopPayload;
  }

  if (parseResult.data.tenantName) {
    payload.tenant_name = parseResult.data.tenantName;
  }

  if (parseResult.data.planId !== undefined) {
    payload.plan_id = parseResult.data.planId;
  }

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) return new NextResponse(JSON.stringify(data), { status: response.status });
  return new NextResponse(JSON.stringify(data), { status: response.status });
}