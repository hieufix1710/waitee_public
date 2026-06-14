export async function POST(request: Request) {
  const body = await request.json();
  const origin = new URL(request.url).origin;
  const proxyUrl = `${origin}/backend-api/api/user/send_email_verification`;

  const response = await fetch(proxyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), { status: response.status });
}
