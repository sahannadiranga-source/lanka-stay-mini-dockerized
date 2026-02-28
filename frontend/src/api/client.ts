const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function apiGet<T>(path: string, admin = false): Promise<T> {
  const headers: Record<string, string> = {};
  if (admin) {
    const adminKey = import.meta.env.VITE_ADMIN_KEY;
    if (adminKey) headers["X-ADMIN-KEY"] = adminKey;
  }

  const res = await fetch(`${BASE_URL}${path}`, { headers });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}
export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody,
  admin = false
): Promise<TResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (admin) {
    const adminKey = import.meta.env.VITE_ADMIN_KEY;
    if (adminKey) headers["X-ADMIN-KEY"] = adminKey;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST ${path} failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<TResponse>;
}