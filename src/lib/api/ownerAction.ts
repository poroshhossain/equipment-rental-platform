import type {
  AdminRental,
  AdminUser,
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
  UserRole,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

let cachedToken: string | null = null;

/** Client Components get a JWT from the better-auth session on first use. */
async function browserToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (cachedToken) return cachedToken;

  try {
    const response = await fetch("/api/auth/token");
    if (!response.ok) return null;
    const body = (await response.json()) as { token?: string };
    cachedToken = body.token ?? null;
    return cachedToken;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  token?: string,
  init?: RequestInit,
): Promise<T> {
  const authToken = token ?? (await browserToken());
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("Cannot reach the API. Is the backend running?");
  }

  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "API request failed.");

  return body.data as T;
}

/** Reads show empty states instead of crashing when the API rejects a request. */
async function read<T>(path: string, fallback: T, token?: string): Promise<T> {
  try {
    return (await request<T>(path, token)) ?? fallback;
  } catch {
    return fallback;
  }
}

export const getAllEquipment = (token?: string) =>
  read<Equipment[]>("/api/v1/equipments", [], token);
export const getRentals = (token?: string) =>
  read<EquipmentRental[]>("/api/v1/owner/rentals", [], token);
export const getRevenue = (token?: string) =>
  read<MonthlyRevenue[]>("/api/v1/owner/revenue", [], token);
export const getOwnerProfile = (token?: string) =>
  read<OwnerProfile | null>("/api/v1/owner/profile", null, token);

export const postEquipment = (equipment: NewEquipment, token?: string) =>
  request<Equipment>(
    "/api/v1/equipments",
    token,
    { method: "POST", body: JSON.stringify(equipment) },
  );

export const updateEquipment = (
  id: string,
  equipment: NewEquipment,
  token?: string,
) =>
  request<Equipment>(
    `/api/v1/equipments/${id}`,
    token,
    { method: "PATCH", body: JSON.stringify(equipment) },
  );

export const deleteEquipment = (id: string, token?: string) =>
  request(`/api/v1/equipments/${id}`, token, { method: "DELETE" });

export const saveOwnerProfile = (profile: OwnerProfileInput, token?: string) =>
  request<OwnerProfile>(
    "/api/v1/owner/profile",
    token,
    { method: "PATCH", body: JSON.stringify(profile) },
  );

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
  page?: number;
}

/** All filters are applied by MongoDB through query parameters. */
export async function getEquipmentList(
  query: EquipmentQuery = {},
  token?: string,
): Promise<Equipment[]> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const search = params.toString();

  return read<Equipment[]>(
    `/api/v1/equipments${search ? `?${search}` : ""}`,
    [],
    token,
  );
}

export const getEquipmentById = (id: string, token?: string) =>
  read<Equipment | null>(`/api/v1/equipments/${id}`, null, token);

export const getCategories = (token?: string) =>
  read<Category[]>("/api/v1/categories", [], token);
export const getReviews = (token?: string) =>
  read<Review[]>("/api/v1/reviews", [], token);

export const getFavorites = (userId: string, token?: string) =>
  read<Equipment[]>(
    `/api/v1/customer/favorites?userId=${encodeURIComponent(userId)}`,
    [],
    token,
  );

export const addFavorite = (userId: string, equipmentId: string, token?: string) =>
  request(
    "/api/v1/customer/favorites",
    token,
    { method: "POST", body: JSON.stringify({ userId, equipmentId }) },
  );

export const removeFavorite = (
  userId: string,
  equipmentId: string,
  token?: string,
) =>
  request(
    `/api/v1/customer/favorites/${equipmentId}?userId=${encodeURIComponent(userId)}`,
    token,
    { method: "DELETE" },
  );

export const createBooking = (booking: BookingInput, token?: string) =>
  request<Booking>(
    "/api/v1/customer/bookings",
    token,
    { method: "POST", body: JSON.stringify(booking) },
  );

export const getBooking = (id: string, token?: string) =>
  read<Booking | null>(`/api/v1/customer/bookings/${id}`, null, token);

export const createCheckout = (bookingId: string, token?: string) =>
  request<{ url: string | null }>(
    "/api/v1/payments/checkout",
    token,
    { method: "POST", body: JSON.stringify({ bookingId }) },
  );

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  status: string;
}

export const getPayment = (bookingId: string, token?: string) =>
  read<PaymentRecord | null>(
    `/api/v1/payments?bookingId=${encodeURIComponent(bookingId)}`,
    null,
    token,
  );

export const getUserBookings = (userId: string, token?: string) =>
  read<Booking[]>(
    `/api/v1/customer/bookings?userId=${encodeURIComponent(userId)}`,
    [],
    token,
  );

export const getUserProfile = (userId: string, token?: string) =>
  read<UserProfile | null>(
    `/api/v1/profile?userId=${encodeURIComponent(userId)}`,
    null,
    token,
  );

export const saveUserProfile = (profile: UserProfile, token?: string) =>
  request<UserProfile>(
    "/api/v1/profile",
    token,
    { method: "PATCH", body: JSON.stringify(profile) },
  );

export const getAdminUsers = (token?: string) =>
  read<AdminUser[]>("/api/v1/admin/users", [], token);

export const changeUserRole = (id: string, role: UserRole, token?: string) =>
  request<AdminUser>(
    `/api/v1/admin/users/${id}/role`,
    token,
    { method: "PATCH", body: JSON.stringify({ role }) },
  );

export const deleteAdminUser = (id: string, token?: string) =>
  request(`/api/v1/admin/users/${id}`, token, { method: "DELETE" });

export const getAdminEquipment = (token?: string) =>
  read<Equipment[]>("/api/v1/admin/equipments", [], token);

export const setEquipmentStatus = (
  id: string,
  status: Equipment["status"],
  token?: string,
) =>
  request<Equipment>(
    `/api/v1/admin/equipments/${id}/status`,
    token,
    { method: "PATCH", body: JSON.stringify({ status }) },
  );

export const getAdminRentals = (token?: string) =>
  read<AdminRental[]>("/api/v1/admin/rentals", [], token);

export const updateRentalStatus = (
  id: string,
  status: {
    paymentStatus?: Booking["paymentStatus"];
    bookingStatus?: Booking["bookingStatus"];
  },
  token?: string,
) =>
  request<AdminRental>(
    `/api/v1/admin/rentals/${id}/status`,
    token,
    { method: "PATCH", body: JSON.stringify(status) },
  );
