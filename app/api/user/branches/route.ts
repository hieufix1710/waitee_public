// Adds a branch (store) to one of the signed-in merchant's existing tenants
// through Rails' management API (`POST /api/man/stores`). The `Tenant` header
// scopes the call to that tenant; auth is forwarded so both OAuth (Doorkeeper)
// and legacy (X-Waitee-Token) sessions work. When the branch exceeds the plan's
// included branches, Rails returns a quote (`confirmation_required`) instead of
// creating; the client re-sends with `confirmed: true` to accept the extra fee.
export async function POST(request: Request) {
  const body = (await request.json()) as {
    tenant?: string;
    shop?: { name?: string; address?: string };
    confirmed?: boolean;
  };

  const tenant = body.tenant?.trim();
  const name = body.shop?.name?.trim();
  const address = body.shop?.address?.trim();

  if (!tenant) {
    return new Response(JSON.stringify({ message: 'Missing tenant' }), { status: 400 });
  }
  if (!name || !address) {
    return new Response(JSON.stringify({ message: 'Missing store name or address' }), {
      status: 400,
    });
  }

  const origin = new URL(request.url).origin;
  const proxyUrl = `${origin}/backend-api/api/man/stores`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Tenant: tenant,
  };
  const authorization = request.headers.get('authorization');
  if (authorization) headers['Authorization'] = authorization;
  const waitToken = request.headers.get('x-waitee-token');
  if (waitToken) headers['X-Waitee-Token'] = waitToken;

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      store: { name, full_address: address },
      confirmed: body.confirmed === true,
    }),
  });
  const data = await response.json().catch(() => ({}));
  return new Response(JSON.stringify(data), { status: response.status });
}
