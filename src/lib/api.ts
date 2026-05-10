/**
 * CIVICOS — API CLIENT
 * Typed fetch wrapper for backend communication.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const requestId = crypto.randomUUID();

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  headers.set("X-Request-ID", requestId);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.detail || "Request failed");
  }

  if (response.status === 204) return {} as T;

  return response.json();
}

export const api = {
  get: <T>(path: string, options?: RequestInit) => 
    request<T>(path, { ...options, method: "GET" }),
  
  post: <T>(path: string, body?: unknown, options?: RequestInit) => 
    request<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  
  put: <T>(path: string, body?: unknown, options?: RequestInit) => 
    request<T>(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  
  patch: <T>(path: string, body?: unknown, options?: RequestInit) => 
    request<T>(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  
  delete: <T>(path: string, options?: RequestInit) => 
    request<T>(path, { ...options, method: "DELETE" }),
};
