/**
 * Shared types, options and status labels used by the dashboard.
 * All record data comes from the API — see src/lib/api/ownerAction.ts.
 */

export type RentalType = "daily" | "weekly" | "monthly";
export type EquipmentCondition = "new" | "excellent" | "good" | "fair";
export type EquipmentStatus = "pending" | "approved" | "rejected" | "paused";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";
export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

export interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  avatar: string;
  bio: string;
  licenseNumber: string;
  joinedAt: string;
  verified: boolean;
}

/** Fields the owner is allowed to edit on the profile page. */
export type OwnerProfileInput = Pick<
  OwnerProfile,
  "name" | "email" | "phone" | "company" | "location" | "bio" | "licenseNumber"
>;

export interface Equipment {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: RentalType;
  availableQuantity: number;
  totalQuantity: number;
  condition: EquipmentCondition;
  brand: string;
  model: string;
  image: string;
  terms: string;
  status: EquipmentStatus;
  createdAt: string;
  popularity?: number;
  owner?: OwnerProfile;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  order: number;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  createdAt: string;
}

/** Request body for creating or updating equipment. */
export type NewEquipment = Omit<
  Equipment,
  "id" | "createdAt" | "totalQuantity"
> & {
  totalQuantity?: number;
  owner?: OwnerProfile;
};

export interface RentalCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface EquipmentRental {
  id: string;
  customer: RentalCustomer;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: string;
  equipmentImage: string;
  startDate: string;
  endDate: string;
  rentalType: RentalType;
  quantity: number;
  bookingAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
}

export interface MonthlyRevenue {
  month: string;
  amount: number;
}

export interface BookingInput {
  equipmentId: string;
  userId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  contactNumber: string;
  deliveryAddress: string;
  notes?: string;
  customer?: { name: string; email: string };
}

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  userId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  rentalType: RentalType;
  days: number;
  totalAmount: number;
  contactNumber: string;
  deliveryAddress: string;
  notes: string;
  status: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export const EQUIPMENT_CATEGORIES = [
  "Construction",
  "Power Tools",
  "Photography",
  "Events",
  "Gardening",
  "Transport",
] as const;

/** Links the seeded marketing categories to equipment category values. */
export const CATEGORY_BY_SLUG: Record<string, string> = {
  construction: "Construction",
  photography: "Photography",
  transport: "Transport",
  agriculture: "Gardening",
  electronics: "Power Tools",
  events: "Events",
};

export const RENTAL_TYPE_OPTIONS: {
  value: RentalType;
  label: string;
  suffix: string;
  hint: string;
}[] = [
  { value: "daily", label: "Daily", suffix: "day", hint: "Best for short jobs" },
  { value: "weekly", label: "Weekly", suffix: "week", hint: "Save on longer jobs" },
  {
    value: "monthly",
    label: "Monthly",
    suffix: "month",
    hint: "Best for long projects",
  },
];

export const CONDITION_OPTIONS: { value: EquipmentCondition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

export const rentalTypeLabels: Record<RentalType, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export const rentalTypeSuffixes: Record<RentalType, string> = {
  daily: "day",
  weekly: "week",
  monthly: "month",
};

export const conditionLabels: Record<EquipmentCondition, string> = {
  new: "New",
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
};

export const equipmentStatusMeta: Record<
  EquipmentStatus,
  { label: string; tone: StatusTone }
> = {
  pending: { label: "Pending", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
  paused: { label: "Paused", tone: "neutral" },
};

export const paymentStatusMeta: Record<
  PaymentStatus,
  { label: string; tone: StatusTone }
> = {
  paid: { label: "Paid", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  failed: { label: "Failed", tone: "danger" },
  refunded: { label: "Refunded", tone: "neutral" },
};

export const bookingStatusMeta: Record<
  BookingStatus,
  { label: string; tone: StatusTone }
> = {
  pending: { label: "Pending", tone: "warning" },
  confirmed: { label: "Confirmed", tone: "info" },
  active: { label: "Active", tone: "success" },
  completed: { label: "Completed", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "danger" },
};
