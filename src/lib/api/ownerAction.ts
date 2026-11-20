import type {
  AdminAnalytics,
  AdminRental,
  AdminUser,
  Booking,
  BookingInput,
  Category,
  Equipment,
  EquipmentRental,
  MonthlyRevenue,
  NewEquipment,
  OwnerAnalytics,
  OwnerProfile,
  OwnerProfileInput,
  Review,
  UserProfile,
  UserRole,
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

/** Reads show empty states instead of crashing when the API is unavailable. */
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
  page?: number;
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

export const createCheckout = (bookingId: string) =>
  request<{ url: string | null }>("/api/v1/payments/checkout", {
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  status: string;
}

export const getPayment = (bookingId: string) =>
  read<PaymentRecord | null>(
    `/api/v1/payments?bookingId=${encodeURIComponent(bookingId)}`,
    null,
  );

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

export const getAdminAnalytics = () =>
  read<AdminAnalytics | null>("/api/v1/admin/analytics", null);

export const getOwnerEquipment = (ownerEmail: string) =>
  read<Equipment[]>(
    `/api/v1/owner/equipments?ownerEmail=${encodeURIComponent(ownerEmail)}`,
    [],
  );

export const getOwnerRentals = (ownerEmail: string) =>
  read<EquipmentRental[]>(
    `/api/v1/owner/rentals?ownerEmail=${encodeURIComponent(ownerEmail)}`,
    [],
  );

export const getOwnerAnalytics = (ownerEmail: string) =>
  read<OwnerAnalytics | null>(
    `/api/v1/owner/analytics?ownerEmail=${encodeURIComponent(ownerEmail)}`,
    null,
  );

export const getAdminUsers = () => read<AdminUser[]>("/api/v1/admin/users", []);

export const changeUserRole = (id: string, role: UserRole) =>
  request<AdminUser>(`/api/v1/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });

export const deleteAdminUser = (id: string) =>
  request(`/api/v1/admin/users/${id}`, { method: "DELETE" });

export const getAdminEquipment = () =>
  read<Equipment[]>("/api/v1/admin/equipments", []);

export const setEquipmentStatus = (id: string, status: Equipment["status"]) =>
  request<Equipment>(`/api/v1/admin/equipments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const getAdminRentals = () =>
  read<AdminRental[]>("/api/v1/admin/rentals", []);

export const updateRentalStatus = (
  id: string,
  status: {
    paymentStatus?: Booking["paymentStatus"];
    bookingStatus?: Booking["bookingStatus"];
  },
) =>
  request<AdminRental>(`/api/v1/admin/rentals/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(status),
  });
