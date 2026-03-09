const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
    }
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Expected JSON response but got: ${text.substring(0, 100)}`);
    }
    
    return res.json() as Promise<T>;
  } catch (error: any) {
    if (error.message.includes("fetch")) {
      throw new Error("Cannot connect to backend. Make sure the API server is running.");
    }
    throw error;
  }
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

export async function apiPut<TResponse, TBody>(
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
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PUT ${path} failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<TResponse>;
}

export async function apiDelete(path: string, admin = false): Promise<void> {
  const headers: Record<string, string> = {};

  if (admin) {
    const adminKey = import.meta.env.VITE_ADMIN_KEY;
    if (adminKey) headers["X-ADMIN-KEY"] = adminKey;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`DELETE ${path} failed: ${res.status} ${text}`);
  }
}