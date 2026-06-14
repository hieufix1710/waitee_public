export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const proxyUrl = `${origin}/backend-api/api/user/my_stores`;

  const token = request.headers.get("X-Waitee-Token") || request.headers.get("Authorization") || "";
  const response = await fetch(proxyUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Waitee-Token": token,
    },
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), { status: response.status });
}
