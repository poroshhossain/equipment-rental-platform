import type {
  Booking,
  BookingInput,
  Category,
  Equipment,
  EquipmentRental,
  MonthlyRevenue,
  NewEquipment,
  OwnerProfile,
  OwnerProfileInput,
  Review,
  UserProfile,
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

export interface EquipmentQuery {
  status?: string;
  limit?: number;
  q?: string;
  category?: string;
  rentalType?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: string;
  sort?: string;
}

/** All filters are applied by MongoDB through query parameters. */
export async function getEquipmentList(
  query: EquipmentQuery = {},
): Promise<Equipment[]> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const search = params.toString();

  return read<Equipment[]>(
    `/api/v1/equipments${search ? `?${search}` : ""}`,
    [],
  );
}

export const getEquipmentById = (id: string) =>
  read<Equipment | null>(`/api/v1/equipments/${id}`, null);

export const getCategories = () => read<Category[]>("/api/v1/categories", []);
export const getReviews = () => read<Review[]>("/api/v1/reviews", []);

export const getFavorites = (userId: string) =>
  read<Equipment[]>(
    `/api/v1/customer/favorites?userId=${encodeURIComponent(userId)}`,
    [],
  );

export const addFavorite = (userId: string, equipmentId: string) =>
  request("/api/v1/customer/favorites", {
    method: "POST",
    body: JSON.stringify({ userId, equipmentId }),
  });

export const removeFavorite = (userId: string, equipmentId: string) =>
  request(
    `/api/v1/customer/favorites/${equipmentId}?userId=${encodeURIComponent(userId)}`,
    { method: "DELETE" },
  );

export const createBooking = (booking: BookingInput) =>
  request<Booking>("/api/v1/customer/bookings", {
    method: "POST",
    body: JSON.stringify(booking),
  });

export const getBooking = (id: string) =>
  read<Booking | null>(`/api/v1/customer/bookings/${id}`, null);

export const getUserBookings = (userId: string) =>
  read<Booking[]>(
    `/api/v1/customer/bookings?userId=${encodeURIComponent(userId)}`,
    [],
  );

export const getUserProfile = (userId: string) =>
  read<UserProfile | null>(
    `/api/v1/profile?userId=${encodeURIComponent(userId)}`,
    null,
  );

export const saveUserProfile = (profile: UserProfile) =>
  request<UserProfile>("/api/v1/profile", {
    method: "PATCH",
    body: JSON.stringify(profile),
  });
