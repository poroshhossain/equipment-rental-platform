import type {
  Equipment,
  EquipmentRental,
  MonthlyRevenue,
  NewEquipment,
  OwnerProfile,
  OwnerProfileInput,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new Error("Cannot reach the API. Is the backend running?");
  }

  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "API request failed.");

  return body.data as T;
}

/** Reads show empty states instead of crashing when the backend is offline. */
async function read<T>(path: string, fallback: T): Promise<T> {
  try {
    return (await request<T>(path)) ?? fallback;
  } catch {
    return fallback;
  }
}

export const getAllEquipment = () => read<Equipment[]>("/api/v1/equipments", []);
export const getRentals = () =>
  read<EquipmentRental[]>("/api/v1/owner/rentals", []);
export const getRevenue = () =>
  read<MonthlyRevenue[]>("/api/v1/owner/revenue", []);
export const getOwnerProfile = () =>
  read<OwnerProfile | null>("/api/v1/owner/profile", null);

export const postEquipment = (equipment: NewEquipment) =>
  request<Equipment>("/api/v1/equipments", {
    method: "POST",
    body: JSON.stringify(equipment),
  });

export const updateEquipment = (id: string, equipment: NewEquipment) =>
  request<Equipment>(`/api/v1/equipments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(equipment),
  });

export const deleteEquipment = (id: string) =>
  request(`/api/v1/equipments/${id}`, { method: "DELETE" });

export const saveOwnerProfile = (profile: OwnerProfileInput) =>
  request<OwnerProfile>("/api/v1/owner/profile", {
    method: "PATCH",
    body: JSON.stringify(profile),
  });
