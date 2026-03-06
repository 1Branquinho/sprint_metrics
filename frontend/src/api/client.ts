import type { ApiError } from "@/types/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
};

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${BASE_URL}${normalizedPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") {
        continue;
      }
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  }

  let message = `Request failed with status ${response.status}`;
  try {
    const errorBody = (await response.json()) as { detail?: string };
    if (errorBody?.detail) {
      message = errorBody.detail;
    }
  } catch {
    // Ignore body parsing errors and keep fallback message.
  }

  const error: ApiError = {
    status: response.status,
    message,
  };

  throw error;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", query, body, headers } = options;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return parseResponse<T>(response);
}
