// Proxies the signed-in user's accessible stores (owner/manager/staff across
// tenants) to Rails. Forwards both auth headers so OAuth (Doorkeeper) and
// legacy (X-Waitee-Token) sessions work.
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const proxyUrl = `${origin}/backend-api/api/user/accessible_stores`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const authorization = request.headers.get('authorization');
  if (authorization) headers['Authorization'] = authorization;
  const waitToken = request.headers.get('x-waitee-token');
  if (waitToken) headers['X-Waitee-Token'] = waitToken;

  const response = await fetch(proxyUrl, {
    method: 'GET',
    headers,
    cache: 'no-store',
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), { status: response.status });
}
