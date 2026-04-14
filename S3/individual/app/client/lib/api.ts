export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;
  detail?: string;

  constructor(status: number, detail?: string) {
    super(detail ?? `API request failed: ${status}`);
    this.status = status;
    this.detail = detail;
  }
}

export type UserCard = {
  id: string;
  day_of_week: string;
  booking_channel: string;
  service_type: string;
  reminder_sent: number;
};

export type UserDetail = {
  id: string;
  probability: number;
  prediction: number;
  threshold: number;
  patient: Record<string, number | string>;
  top_factors: Array<{ feature: string; impact: number }>;
};

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    let detail: string | undefined;
    try {
      const payload = (await response.json()) as { detail?: string };
      detail = payload.detail;
    } catch {
      detail = undefined;
    }
    throw new ApiError(response.status, detail);
  }
  return (await response.json()) as T;
}

export function getUsers(): Promise<UserCard[]> {
  return apiGet<UserCard[]>("/users");
}

export function getUser(id: string): Promise<UserDetail> {
  return apiGet<UserDetail>(`/users/${id}`);
}
