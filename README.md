# EquipRent — Equipment Rental Platform

A modern equipment rental marketplace built with Next.js, TypeScript and better-auth.
Renters can discover equipment, owners can manage their fleet, and admins can oversee
the platform from a shared, role-aware dashboard.

> **Current stage:** front-end complete for the owner dashboard, with realistic mock
> data. Backend/API integration is the next phase — every place that needs an API call
> is marked in the code.

---

## Tech Stack

| Layer      | Technology                                       |
| ---------- | ------------------------------------------------ |
| Framework  | Next.js 16 (App Router, React Compiler, Turbopack) |
| Language   | TypeScript                                       |
| Styling    | Tailwind CSS v4 + shadcn/ui (base-ui primitives) |
| Auth       | better-auth (email/password + Google)            |
| Database   | MongoDB (server-side, configured)                |
| Forms      | React Hook Form + Zod                            |
| Icons      | lucide-react                                     |
| Toasts     | Sonner                                           |

---

## Features

### Owner Dashboard

- **Overview** — revenue chart, key stats, recent rentals, pending-review queue and
  quick actions.
- **Add Equipment** — full listing form with validation:
  - name, description, category, brand, model
  - pickup location, rental price, rental type (daily / weekly / monthly)
  - available quantity, condition
  - image upload with drag & drop preview (or pasted image URL)
  - rental terms and conditions
  - owner information (read-only, pulled from the profile)
  - listing status defaults to **Pending** and is reviewed by an admin
- **My Equipment** — responsive table of the logged-in owner's listings with:
  - search + category/status filters and summary stat cards
  - equipment, category, rental price, available quantity, status
  - **View details** drawer, **Update** page and **Delete** confirmation with undo
  - mobile-friendly card layout
- **My Equipment Rental** — booking table with:
  - customer information, equipment information
  - rental duration and required quantity
  - booking amount, payment status and booking status
  - search and status filters + revenue stat cards
- **My Profile** — owner profile with editable personal/business details, account
  status, verification badges and lifetime stats.

### Dashboard Shell

- Shared, collapsible sidebar with icon-only mode and tooltips.
- Role-aware navigation for **customer**, **owner** and **admin**, driven by a typed
  config in `src/lib/dashboard-nav.ts`.
- Sticky header with the current page title, role chip and public-site link.
- User card with avatar, email and sign-out.

### Authentication UI

- Login and registration screens with validation UI, password visibility toggle,
  Google sign-in button and responsive auth layout.
- better-auth configured with a `role` field (defaults to `customer`).

### Public Site

- Landing page shell, responsive public header/navbar and shared design tokens
  (brand blue, light/dark themes).

---

## Routes

| Route                              | Description                         |
| ---------------------------------- | ----------------------------------- |
| `/`                                | Public landing page                 |
| `/login`, `/register`              | Authentication screens              |
| `/dashboard/owner`                 | Owner overview                      |
| `/dashboard/add-equipment`         | Create a new equipment listing      |
| `/dashboard/my-equipment`          | Owner's equipment table             |
| `/dashboard/my-equipment/[id]/edit`| Update a listing                    |
| `/dashboard/my-equipment-rentals`  | Rentals/bookings for owner gear     |
| `/dashboard/my-profile`            | Owner profile                       |
| `/dashboard/customer`              | Customer dashboard (placeholder)    |
| `/dashboard/admin`                 | Admin dashboard (placeholder)       |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                     # Login & register routes
│   ├── (dashboard)/dashboard/
│   │   ├── add-equipment/          # Add equipment page
│   │   ├── my-equipment/           # Listing table + [id]/edit update page
│   │   ├── my-equipment-rentals/   # Bookings table
│   │   ├── my-profile/             # Owner profile
│   │   ├── owner/                  # Owner overview
│   │   ├── customer/ | admin/      # Role placeholders
│   │   └── layout.tsx              # Dashboard shell (sidebar + header)
│   ├── (public)/                   # Public site routes
│   └── api/auth/[...all]/          # better-auth handler
├── components/
│   ├── auth/                       # Login, register, password & photo fields
│   ├── dashboard/
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── PageHeader.tsx
│   │   ├── StatCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── EmptyState.tsx
│   │   └── owner/                  # EquipmentForm, tables, profile view
│   ├── public/                     # Header, navbar, logo
│   └── ui/                         # shadcn/base-ui primitives
├── hooks/                          # use-mobile
└── lib/
    ├── auth.ts / auth-client.ts    # better-auth server & client config
    ├── dashboard-nav.ts            # Typed role-based navigation config
    ├── owner-data.ts               # Mock equipment, rentals, profile + status meta
    ├── format.ts                   # Currency, date and initial helpers
    └── validations/                # Zod schemas
```

---

## Mock Data & API Integration

All owner pages read from `src/lib/owner-data.ts`:

- `fakeOwner` — owner profile
- `fakeEquipment` — equipment listings
- `fakeRentals` — rental bookings
- `monthlyRevenue` — overview chart data
- status label/tone maps used by badges

Equipment photos are remote Unsplash URLs used as placeholders. Replace them with
uploaded image URLs once the image endpoint is connected.

Each page/component also contains a `TODO` where the real request belongs. Suggested
endpoints for the backend phase:

| Method   | Endpoint                          | Used by                  |
| -------- | --------------------------------- | ------------------------ |
| `GET`    | `/api/owner/equipment`            | My Equipment             |
| `POST`   | `/api/owner/equipment`            | Add Equipment            |
| `GET`    | `/api/owner/equipment/:id`        | Edit page                |
| `PATCH`  | `/api/owner/equipment/:id`        | Update listing           |
| `DELETE` | `/api/owner/equipment/:id`        | Delete listing           |
| `GET`    | `/api/owner/rentals`              | My Equipment Rental      |
| `GET`    | `/api/owner/profile`              | My Profile               |
| `PATCH`  | `/api/owner/profile`              | Save profile             |
| `POST`   | `/api/uploads`                    | Equipment / avatar image |

Form submissions currently validate, log the payload to the browser console, show a
toast and redirect — swap the `TODO` block for the real request.

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB connection string (for the auth backend)

### Environment variables

Create `.env` in the project root:

```bash
DB_URL="mongodb://localhost:27017"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Install & run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

### Scripts

```bash
npm run dev      # Start the dev server
npm run build    # Production build
npm run start    # Start the production server
npm run lint     # ESLint
```

---

## Roadmap

- [ ] Wire owner pages to the API endpoints above.
- [ ] Add server-side auth/role guards for dashboard routes.
- [ ] Complete the customer dashboard (rentals, favorites, checkout).
- [ ] Complete the admin dashboard (users, equipment, rentals, reports).
- [ ] Connect image uploads (ImgBB) and real payment status updates.
- [ ] Add automated tests for forms and tables.
