import { Shop } from "@/api/shop/shop";
import Image from "next/image";

type Params = Promise<{ shopId: string; tenant: string }>;

export async function generateMetadata({ params }: { params: Params }) {
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
    if (!shop.id) {
        return {
        };
    }

    if (!result.id) {
        return {
            title: "Store Not Found",
            description: "No details available.",
            robots: "noindex, nofollow",
            openGraph: {
                title: "Store Not Found",
                description: "No details available.",
                url: `https://client.waitee.top/${tenant}/${shopId}`,
                type: "website",
            },
        };
    }

    return {
        title: result.name,
        description: result.description,
        keywords: result.keywords || ["cửa hàng", "waitee", ...shop.name.split(" ")],
        robots: "index, follow"
    };
}

async function Page({ params }: { params: Params }) {
  // asynchronous access of `params.id`.
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
  if (!result.id) {
    return (
      <div className="max-w-xl mx-auto my-20 p-10 rounded-3xl bg-white shadow-2xl border border-blue-100 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          Không tìm thấy cửa hàng
        </h1>
        <p className="text-gray-600 mb-6">
          {`Chúng tôi không thể tìm thấy cửa hàng bạn đang tìm kiếm. Vui lòng kiểm tra lại đường dẫn hoặc thử lại sau.`}
        </p>
      </div>
    );
  }

  const shopData = new Shop(result);

  return (
    <div className="p-10 bg-gradient-to-br from-white via-blue-50 to-blue-100 border-blue-100 h-svh">
      <div className="flex flex-col items-center">
        {shopData.logo && (
          <div className="mb-6">
            <Image
              src={shopData.logo.url}
              alt={shopData.name}
              width={160}
              height={160}
              className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-blue-200 bg-white"
            />
          </div>
        )}
        <h1 className="text-5xl font-extrabold mb-2 text-blue-900 drop-shadow-sm text-center">
          {shopData.name}
        </h1>
        <p className="text-gray-500 mb-4 text-center">
          <span className="font-medium">Mã cửa hàng:</span> {shopId} &nbsp;
        </p>
      </div>
      <hr className="my-8 border-blue-200" />
      <section className="text-center">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">
          Chào mừng đến với{" "}
          <span className="text-blue-800">{shopData.name}</span>!
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          {shopData.description ||
            "Khám phá cửa hàng của chúng tôi và tận hưởng trải nghiệm độc đáo. Chúng tôi cung cấp những sản phẩm và dịch vụ tốt nhất dành riêng cho bạn!"}
        </p>
        <a
          href={`https://client.waitee.top/${tenant}/${shopId}`}
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition"
        >
          Khám phá sản phẩm
        </a>
      </section>
    </div>
  );
}

export default Page;
