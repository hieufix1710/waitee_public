import { NextResponse } from "next/server";
import { z } from 'zod';

const signupApiSchema = z.object({
    user: z.object({
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        phone: z.string().min(1),
    }),
    shop: z.object({
        name: z.string().min(1),
        address: z.string().min(1),
        categoryId: z.string().min(1),
        customCategory: z.string().optional(),
    }),
    planId: z.any().optional(),
}).refine((data) => {
    if (data.shop.categoryId === '-1') { // Assuming '-1' is the value for "Other"
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
        const { name: shop_name, address, categoryId: category_id, customCategory } = parseResult.data.shop;
        const { email, password, firstName: first_name, lastName: last_name, phone } = parseResult.data.user;

    const origin = new URL(request.url).origin;
    const proxyUrl = `${origin}/backend-api/api/user/onboard`;

    const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            shop: {
                name: shop_name,
                address,
                store_category_id: category_id,
                custom_category: customCategory,
            },
            user: {
                email,
                password,
                first_name,
                last_name,
                phone,
            },
            plan_id: parseResult.data.planId,
        }),
    });
    const data = await response.json();
    if (!response.ok) return new NextResponse(JSON.stringify(data), { status: response.status });
    return new NextResponse(JSON.stringify(data), { status: response.status });
}