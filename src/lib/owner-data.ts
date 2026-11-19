/**
 * Fake owner dashboard data.
 * Replace these seeds with API calls once the backend endpoints are ready.
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
}

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

export const EQUIPMENT_CATEGORIES = [
  "Construction",
  "Power Tools",
  "Photography",
  "Events",
  "Gardening",
  "Transport",
] as const;

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

export const fakeOwner: OwnerProfile = {
  id: "own_01",
  name: "Marcus Bennett",
  email: "marcus.bennett@equiprent.com",
  phone: "+1 (415) 555-0148",
  company: "Bennett Equipment Co.",
  location: "San Francisco, CA",
  avatar:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80",
  bio: "Heavy equipment owner with 12 years of experience renting construction and photography gear across the Bay Area.",
  licenseNumber: "CA-BIZ-884219",
  joinedAt: "2024-03-18",
  verified: true,
};

export const fakeEquipment: Equipment[] = [
  {
    id: "eq_1001",
    name: "CAT 320 Excavator",
    description:
      "Powerful 20-ton excavator suited for digging, trenching and site preparation. Delivered with a trained operator on request.",
    category: "Construction",
    location: "San Francisco, CA",
    rentalPrice: 450,
    rentalType: "daily",
    availableQuantity: 2,
    totalQuantity: 3,
    condition: "excellent",
    brand: "Caterpillar",
    model: "320 GC",
    image:
      "https://images.unsplash.com/photo-1652613015049-be06063b559c?auto=format&fit=crop&w=800&q=80",
    terms:
      "Valid ID and proof of insurance required. Fuel is not included. Delivery available within 40 miles for an additional fee.",
    status: "approved",
    createdAt: "2026-10-02",
  },
  {
    id: "eq_1002",
    name: "Canon EOS R5 Camera Kit",
    description:
      "Full-frame mirrorless camera kit with 24-105mm lens, two batteries, charger, SD card and a hard travel case.",
    category: "Photography",
    location: "Oakland, CA",
    rentalPrice: 85,
    rentalType: "daily",
    availableQuantity: 4,
    totalQuantity: 5,
    condition: "excellent",
    brand: "Canon",
    model: "EOS R5",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    terms:
      "A refundable security deposit of $300 is required. Damage caused by water or sand is not covered.",
    status: "approved",
    createdAt: "2026-10-14",
  },
  {
    id: "eq_1003",
    name: "Bosch Rotary Hammer",
    description:
      "SDS-plus rotary hammer for concrete drilling and light demolition. Includes three bits and a carrying case.",
    category: "Power Tools",
    location: "San Francisco, CA",
    rentalPrice: 35,
    rentalType: "daily",
    availableQuantity: 6,
    totalQuantity: 6,
    condition: "good",
    brand: "Bosch",
    model: "GBH 2-28",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    terms:
      "Return clean and free of concrete dust. Missing accessories are charged at replacement cost.",
    status: "pending",
    createdAt: "2026-11-08",
  },
  {
    id: "eq_1004",
    name: "DJI Mavic 3 Pro Drone",
    description:
      "Professional drone with Hasselblad camera, three batteries and a controller. Ideal for aerial photography and site surveys.",
    category: "Photography",
    location: "Berkeley, CA",
    rentalPrice: 120,
    rentalType: "daily",
    availableQuantity: 3,
    totalQuantity: 4,
    condition: "new",
    brand: "DJI",
    model: "Mavic 3 Pro",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80",
    terms:
      "Pilot must hold a valid Part 107 certificate. Flight logs are reviewed after each rental.",
    status: "pending",
    createdAt: "2026-11-11",
  },
  {
    id: "eq_1005",
    name: "Honda EU3000iS Generator",
    description:
      "Quiet 3000W portable generator for events and job sites. Runs up to 20 hours on a full tank at quarter load.",
    category: "Events",
    location: "San Jose, CA",
    rentalPrice: 60,
    rentalType: "daily",
    availableQuantity: 5,
    totalQuantity: 6,
    condition: "good",
    brand: "Honda",
    model: "EU3000iS",
    image:
      "https://images.unsplash.com/photo-1680796261004-cb56372e3599?auto=format&fit=crop&w=800&q=80",
    terms:
      "Fuel is the renter's responsibility. Generator must be returned with a full tank.",
    status: "pending",
    createdAt: "2026-11-13",
  },
  {
    id: "eq_1006",
    name: "Bobcat S650 Skid Steer",
    description:
      "Compact skid steer with bucket attachment for loading, grading and snow removal. Trailer delivery included within 25 miles.",
    category: "Construction",
    location: "San Francisco, CA",
    rentalPrice: 390,
    rentalType: "daily",
    availableQuantity: 1,
    totalQuantity: 2,
    condition: "good",
    brand: "Bobcat",
    model: "S650",
    image:
      "https://images.unsplash.com/photo-1650220691079-7358e0760f1c?auto=format&fit=crop&w=800&q=80",
    terms:
      "Operators must provide a valid driver's license and sign a safety waiver before pickup.",
    status: "paused",
    createdAt: "2026-09-21",
  },
  {
    id: "eq_1007",
    name: "Makita Circular Saw",
    description:
      "15-amp circular saw with a 7-1/4 inch blade, rip fence and dust collection port. Great for framing and decking.",
    category: "Power Tools",
    location: "Daly City, CA",
    rentalPrice: 20,
    rentalType: "daily",
    availableQuantity: 8,
    totalQuantity: 10,
    condition: "excellent",
    brand: "Makita",
    model: "5008MGA",
    image:
      "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?auto=format&fit=crop&w=800&q=80",
    terms:
      "Blades are inspected on return. Bent or broken blades are charged at $25 each.",
    status: "pending",
    createdAt: "2026-11-16",
  },
  {
    id: "eq_1008",
    name: "JBL EON715 PA Speaker",
    description:
      "Powered 15-inch PA speaker with Bluetooth and XLR inputs. Perfect for weddings, parties and corporate events.",
    category: "Events",
    location: "Oakland, CA",
    rentalPrice: 45,
    rentalType: "daily",
    availableQuantity: 6,
    totalQuantity: 8,
    condition: "new",
    brand: "JBL",
    model: "EON715",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    terms:
      "Speakers must stay indoors or under cover. Stands and cables are included in the rental.",
    status: "pending",
    createdAt: "2026-11-17",
  },
];

export const fakeRentals: EquipmentRental[] = [
  {
    id: "bk_9001",
    customer: {
      name: "Sarah Mitchell",
      email: "sarah.mitchell@example.com",
      phone: "+1 (415) 555-0192",
    },
    equipmentId: "eq_1001",
    equipmentName: "CAT 320 Excavator",
    equipmentCategory: "Construction",
    equipmentImage:
      "https://images.unsplash.com/photo-1652613015049-be06063b559c?auto=format&fit=crop&w=400&q=80",
    startDate: "2026-11-16",
    endDate: "2026-11-21",
    rentalType: "daily",
    quantity: 1,
    bookingAmount: 2250,
    paymentStatus: "paid",
    bookingStatus: "active",
    createdAt: "2026-11-12",
  },
  {
    id: "bk_9002",
    customer: {
      name: "James Carter",
      email: "james.carter@example.com",
      phone: "+1 (510) 555-0134",
    },
    equipmentId: "eq_1004",
    equipmentName: "DJI Mavic 3 Pro Drone",
    equipmentCategory: "Photography",
    equipmentImage:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=400&q=80",
    startDate: "2026-11-24",
    endDate: "2026-11-27",
    rentalType: "daily",
    quantity: 2,
    bookingAmount: 720,
    paymentStatus: "pending",
    bookingStatus: "pending",
    createdAt: "2026-11-18",
  },
  {
    id: "bk_9003",
    customer: {
      name: "Emily Nguyen",
      email: "emily.nguyen@example.com",
      phone: "+1 (628) 555-0177",
    },
    equipmentId: "eq_1002",
    equipmentName: "Canon EOS R5 Camera Kit",
    equipmentCategory: "Photography",
    equipmentImage:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
    startDate: "2026-11-22",
    endDate: "2026-11-24",
    rentalType: "daily",
    quantity: 1,
    bookingAmount: 170,
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    createdAt: "2026-11-17",
  },
  {
    id: "bk_9004",
    customer: {
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+1 (408) 555-0119",
    },
    equipmentId: "eq_1005",
    equipmentName: "Honda EU3000iS Generator",
    equipmentCategory: "Events",
    equipmentImage:
      "https://images.unsplash.com/photo-1680796261004-cb56372e3599?auto=format&fit=crop&w=400&q=80",
    startDate: "2026-10-28",
    endDate: "2026-11-04",
    rentalType: "daily",
    quantity: 2,
    bookingAmount: 840,
    paymentStatus: "paid",
    bookingStatus: "completed",
    createdAt: "2026-10-20",
  },
  {
    id: "bk_9005",
    customer: {
      name: "Olivia Davis",
      email: "olivia.davis@example.com",
      phone: "+1 (925) 555-0163",
    },
    equipmentId: "eq_1008",
    equipmentName: "JBL EON715 PA Speaker",
    equipmentCategory: "Events",
    equipmentImage:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80",
    startDate: "2026-11-25",
    endDate: "2026-11-26",
    rentalType: "daily",
    quantity: 4,
    bookingAmount: 180,
    paymentStatus: "pending",
    bookingStatus: "confirmed",
    createdAt: "2026-11-18",
  },
  {
    id: "bk_9006",
    customer: {
      name: "Daniel Kim",
      email: "daniel.kim@example.com",
      phone: "+1 (669) 555-0155",
    },
    equipmentId: "eq_1003",
    equipmentName: "Bosch Rotary Hammer",
    equipmentCategory: "Power Tools",
    equipmentImage:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80",
    startDate: "2026-11-10",
    endDate: "2026-11-14",
    rentalType: "daily",
    quantity: 2,
    bookingAmount: 280,
    paymentStatus: "failed",
    bookingStatus: "cancelled",
    createdAt: "2026-11-07",
  },
];

export const monthlyRevenue = [
  { month: "Jun", amount: 3120 },
  { month: "Jul", amount: 4280 },
  { month: "Aug", amount: 3860 },
  { month: "Sep", amount: 5120 },
  { month: "Oct", amount: 4650 },
  { month: "Nov", amount: 5840 },
];
