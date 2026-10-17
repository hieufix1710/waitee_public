// Proxies account deletion to Rails (`DELETE /api/user/destroy`). Forwards the
// caller's auth (OAuth bearer and/or legacy X-Waitee-Token) plus the Tenant
// header the management API requires to scope the request.
export async function DELETE(request: Request) {
  const origin = new URL(request.url).origin;
  const proxyUrl = `${origin}/backend-api/api/user/destroy`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const authorization = request.headers.get('authorization');
  if (authorization) headers['Authorization'] = authorization;
  const waitToken = request.headers.get('x-waitee-token');
  if (waitToken) headers['X-Waitee-Token'] = waitToken;
  const tenant = request.headers.get('tenant');
  if (tenant) headers['Tenant'] = tenant;

  const response = await fetch(proxyUrl, {
    method: 'DELETE',
    headers,
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({}));
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
