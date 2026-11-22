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
import { authClient } from "@/lib/auth-client";

// Browser tokens are cached briefly; never cache them on the server, where a
// module-level value would leak one user's token into another user's request.
let browserToken: { token: string; expiresAt: number } | null = null;

async function getAuthorizationHeader(): Promise<Record<string, string>> {
  try {
    let token: string | undefined;

    if (typeof window === "undefined") {
      // Server Component: better-auth's Node client has no cookie jar, so
      // forward the incoming session cookie to /api/auth/token explicitly.
      const { headers } = await import("next/headers");
      const cookie = (await headers()).get("cookie");
      const result = await authClient.token(undefined, {
        headers: cookie ? { cookie } : {},
      });
      token = result.data?.token;
    } else {
      if (browserToken && browserToken.expiresAt > Date.now()) {
        token = browserToken.token;
      } else {
        const result = await authClient.token();
        token = result.data?.token;
        if (token) {
          // Tokens live 15 minutes; refresh a little earlier.
          browserToken = { token, expiresAt: Date.now() + 10 * 60 * 1000 };
        }
      }
    }

    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    // Public pages still work when there is no session.
    return {};
  }
}

// All app data comes from the Express API. MongoDB is only touched by the server.
// Normalize a trailing slash: `${API_URL}/api/v1/...` would otherwise become
// `//api/v1/...`, which Vercel answers with a 308 that breaks CORS preflight.
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    const authHeader = await getAuthorizationHeader();
    response = await fetch(url, {
      ...init,
      // A Content-Type on a bodyless GET forces a CORS preflight; only send it
      // when there is actually a JSON body.
      headers: {
        ...(init?.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...authHeader,
        ...init?.headers,
      },
    });
  } catch (error) {
    // Network/CORS failures look identical here. Include the URL so the
    // browser console shows exactly which endpoint is misconfigured.
    throw new Error(
      `Cannot reach the API at ${url} — ${
        error instanceof Error ? error.message : "network or CORS error"
      }`,
    );
  }

  // A 404/500 page is HTML — parsing it as JSON produced the confusing
  // "Unexpected token '<'" error. Fail with an actionable message instead.
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      "The API returned an unexpected response. Check NEXT_PUBLIC_API_URL and that the backend is running.",
    );
  }

  let body: { data?: T; message?: string };
  try {
    body = await response.json();
  } catch {
    throw new Error("Could not read the API response.");
  }
  if (!response.ok) throw new Error(body.message ?? "API request failed.");

  return body.data as T;
}

const request = <T>(path: string, init?: RequestInit) => {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add the deployed backend URL in Vercel, then rebuild the frontend (NEXT_PUBLIC_* values are baked in at build time).",
    );
  }
  return apiRequest<T>(`${API_URL}${path}`, init);
};

/** Reads show empty states instead of crashing when the API is unavailable. */
async function read<T>(path: string, fallback: T): Promise<T> {
  try {
    return (await request<T>(path)) ?? fallback;
  } catch (error) {
    // Never hide the real cause behind a silent "empty table" on production.
    console.error(
      `[API] ${path} failed:`,
      error instanceof Error ? error.message : error,
    );
    return fallback;
  }
}

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

export interface CheckoutSession {
  url: string | null;
  sessionId?: string;
  paid?: boolean;
}

/** Creates a Stripe Checkout session on the Express backend. */
export const createCheckout = (bookingId: string, userId?: string) =>
  request<CheckoutSession>("/api/v1/payment/checkout", {
    method: "POST",
    body: JSON.stringify({ bookingId, userId }),
  });

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  currency?: string;
  status: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  customerEmail?: string;
  createdAt?: string;
}

export const getPayment = async (bookingId: string) => {
  try {
    return await request<PaymentRecord | null>(
      `/api/v1/payment?bookingId=${encodeURIComponent(bookingId)}`,
    );
  } catch {
    return null;
  }
};

/** Confirms a returned Stripe session through the backend's settlement path. */
export const verifyPayment = (sessionId: string, bookingId?: string) =>
  request<{
    paid: boolean;
    status?: string;
    payment?: PaymentRecord | null;
  }>("/api/v1/payment/verify", {
    method: "POST",
    body: JSON.stringify({ sessionId, bookingId }),
  });

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
