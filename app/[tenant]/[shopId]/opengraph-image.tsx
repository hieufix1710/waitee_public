import { Shop } from '@/api/shop/shop';
import { ImageResponse } from 'next/og'

type Params = Promise<{ shopId: string; tenant: string }>;

// Image metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image({ params }: { params: Params }) {
 const { shopId, tenant } = await params;
    const shopRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/store/${shopId}`,
        {
            headers: {
                Tenant: tenant,
            },
            cache: "no-store", // Ensure fresh data
        },
    );
    const result = await shopRes.json();
    const shop = new Shop(result);

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {shop.description}
      </div>
    ),
    // ImageResponse optionss
    {
      ...size,
    }
  )
}