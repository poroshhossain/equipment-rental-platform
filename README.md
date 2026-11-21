# EquipRent — Equipment Rental Platform

A Next.js + Express equipment rental marketplace. Visitors browse equipment,
logged-in customers save favorites and book gear, and owners manage their fleet
from a role-aware dashboard. All records live in MongoDB behind a small Express API.

> **Live URL:** add the deployed client URL here after deployment.
>
> **Current stage:** public site, customer flows, owner/admin dashboards, Stripe
> checkout, analytics and cron jobs are implemented. Stripe,
> ImgBB and email keys are read from environment variables — add real keys in
> production to enable those integrations.

---

## Tech Stack

| Layer      | Technology                                         |
| ---------- | -------------------------------------------------- |
| Frontend   | Next.js 16 (App Router, Cache Components, Turbopack) |
| Language   | TypeScript                                         |
| Styling    | Tailwind CSS v4 + shadcn/ui (base-ui primitives)   |
| Animation  | Framer Motion                                      |
| Auth       | better-auth (email/password + Google)              |
| Forms      | React Hook Form + Zod                              |
| Backend    | Express 5 + MongoDB (separate project)             |
| Icons      | lucide-react                                       |
| Toasts     | Sonner                                             |

### NPM packages used

- **Client:** `next`, `react`, `react-dom`, `better-auth`, `@better-auth/mongo-adapter`,
  `mongodb`, `framer-motion`, `react-hook-form`, `@hookform/resolvers`, `zod`,
  `sonner`, `lucide-react`, `@base-ui/react`, `class-variance-authority`, `clsx`,
  `tailwind-merge`, `tailwindcss`
- **Server:** `express`, `cors`, `dotenv`, `mongodb`, `stripe`, `node-cron`

All secrets (MongoDB, better-auth, Stripe, ImgBB, Google OAuth) come from `.env`;
copy `.env.example` and never commit real values.

**Stripe setup:** set `STRIPE_SECRET_KEY` to enable Checkout. Optionally set
`STRIPE_WEBHOOK_SECRET` and register `POST /api/webhooks/stripe` in the Stripe
dashboard for automatic settlement; the success page verifies sessions
directly, so payments still settle without the webhook.

---

## Projects

| Path                                               | What it is                       |
| -------------------------------------------------- | -------------------------------- |
| `C:\Projects\a\a9\equipment-rental-platform`        | Next.js front-end (this project) |
| `C:\Projects\a\a9\equipment-rental-platform-server` | Express + MongoDB API            |

Both projects use the same MongoDB database (`equipment-rental-platform`).

---

## Features

### Public Site

- **Home page** — hero banner, featured equipment (6 approved items via MongoDB
  `limit`), categories, why-choose-us, popular equipment, recently added,
  how-it-works and customer reviews. Framer Motion animates the banner, equipment
  cards, categories and reviews.
- **Equipment cards** — clicking *View details* sends logged-out visitors to
  `/login?next=…`; logged-in visitors go to the details page.
- **Catalog** (`/equipments`) — 3-column grid of approved equipment with backend-driven
  search (name/category/location), filters (category, rental type, price range,
  availability)
  and sorting (price ascending/descending, recently added). Filter state lives in the
  URL so results are shareable.
- **Footer** — navigation, account links and contact anchor.

### Customer (private)

- **Equipment details** — image, full information, rental terms, owner details,
  add/remove favorites and a **Book now** modal.
- **Booking modal** — start/end date, quantity, contact number, delivery address
  and notes. The total is calculated from rental duration × rental type × quantity.
  Availability is checked on the server and units are reserved.
- **Payment flow** — confirming a booking opens Stripe Checkout directly. The
  `/payment/success` page verifies the returned session, marks the booking and
  rental paid/confirmed, and records the transaction in the `payments`
  collection. A Stripe webhook at `POST /api/webhooks/stripe` applies the same
  settlement when configured. The `/payment` page remains as a retry fallback.
- **My Rentals** — table of the customer's bookings with dates, total and both
  payment/booking statuses.
- **Favorites** — table of saved equipment in `/dashboard/favorites` with
  *View Details* and *Remove Favorite* actions.

### Shared Account

- **Profile** (`/dashboard/my-profile`) — available to customers, owners and admins.
  Name, email, profile image, phone and address; updates are saved to MongoDB and
  synced with the auth user.

### Owner Dashboard

- Overview stats, 6-month revenue chart, rentals, pending-review queue.
- Add / update / delete equipment and a searchable equipment table.

### Admin Dashboard (admin role only)

- Overview with totals for users, equipment and rentals.
- **All Users** — table of registered accounts with role changes and a manage
  dialog (role buttons + delete user, including auth records). Every table row has
  an *all fields* panel showing the full Mongo record, including nested objects.
- **All Equipment** — every listing with approve/reject, update and delete actions.
- **All Rentals** — all bookings with customer/owner/equipment details, duration,
  amount and editable payment/booking statuses.
- **My Profile** — the shared profile page.

### Dashboard Shell & States

- Private routes guarded by `AuthGuard` in the dashboard layout. Each role group
  (`(owner)`, `(admin)`, `(customer)`) has its own layout with a `RoleGuard`, so the
  check is applied once per group instead of page by page.
- Dashboard loading skeleton, global error page with retry and a 404 page.

---

## Routes

| Route                               | Description                              |
| ----------------------------------- | ---------------------------------------- |
| `/`                                 | Public home page                         |
| `/equipments`                       | Browse approved equipment                |
| `/equipments/[id]`                  | Equipment details (login required)       |
| `/payment?booking=…`                | Booking/payment summary (login required) |
| `/login`, `/register`               | Authentication screens                   |
| `/dashboard/customer`               | Customer dashboard                       |
| `/dashboard/my-rentals`             | Customer's rental bookings               |
| `/dashboard/favorites`              | Saved favorites                          |
| `/dashboard/owner`                  | Owner overview                           |
| `/dashboard/add-equipment`          | Create a listing                         |
| `/dashboard/my-equipment`           | Owner equipment table                    |
| `/dashboard/my-equipment/[id]/edit` | Update a listing                         |
| `/dashboard/my-equipment-rentals`   | Owner rentals                            |
| `/dashboard/my-profile`             | Shared profile (all roles)               |
| `/dashboard/admin`                  | Admin overview                           |
| `/dashboard/all-users`              | Users, roles and account management      |
| `/dashboard/all-equipment`          | Approve/reject/update/delete listings    |
| `/dashboard/all-rentals`            | Monitor and manage all bookings          |

---

## Project Structure

```
equipment-rental-platform/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Login & register
│   │   ├── (dashboard)/dashboard/
│   │   │   ├── (owner)/               # Owner pages + owner RoleGuard layout
│   │   │   ├── (admin)/               # Admin pages + admin RoleGuard layout
│   │   │   ├── (customer)/            # Customer pages + customer RoleGuard layout
│   │   │   ├── my-profile/            # Shared profile (all roles)
│   │   │   ├── layout.tsx             # AuthGuard + dashboard shell
│   │   │   └── loading.tsx            # Dashboard loading skeleton
│   │   ├── (public)/                  # Home, catalog, details, payment
│   │   ├── error.tsx / not-found.tsx  # Error and 404 pages
│   │   └── api/auth/[...all]/         # better-auth handler
│   ├── components/
│   │   ├── auth/AuthGuard.tsx        # Redirects logged-out visitors
│   │   ├── public/
│   │   │   ├── header/               # Navbar, logo
│   │   │   ├── footer/               # Site footer
│   │   │   ├── home/                 # Banner, cards, catalog filters, sections
│   │   │   └── equipment/            # Details, booking modal, payment summary
│   │   ├── dashboard/                # Shell, owner views, rentals/favorites/profile
│   │   └── ui/                       # shadcn/base-ui primitives
│   └── lib/
│       ├── api/ownerAction.ts        # All backend calls
│       ├── auth.ts / auth-client.ts  # better-auth config
│       ├── types.ts                  # Shared types, options, labels
│       ├── format.ts                 # Formatting helpers
│       └── validations/              # Zod schemas
└── README.md

equipment-rental-platform-server/
└── src/
    ├── app.ts                        # Route mounting
    ├── config/                       # DB connection + id serialization
    ├── scripts/seed.ts               # Seeds categories and reviews
    └── modules/
        ├── users/
        ├── content/                  # Categories + reviews
        ├── owner/                    # Equipment, rentals, profile, revenue
        ├── customer/                 # Favorites + bookings
        └── admin/                    # Users, equipment and rental management
```

---

## Backend API

The client calls the Express API directly at `NEXT_PUBLIC_API_URL` (default
`http://localhost:5000`). Only the backend reads and writes MongoDB application
data; the frontend's MongoDB connection is used solely by the better-auth adapter.
Reads fall back to empty states if the API is unavailable; writes show an error.

| Method   | Endpoint                              | Used by                        |
| -------- | ------------------------------------- | ------------------------------ |
| `GET`    | `/api/v1/equipments?status=&q=&category=&rentalType=&minPrice=&maxPrice=&availability=&sort=&limit=` | Home, catalog, dashboard |
| `GET`    | `/api/v1/equipments/:id`              | Details page                   |
| `POST`   | `/api/v1/equipments`                  | Add equipment                  |
| `PATCH`  | `/api/v1/equipments/:id`              | Update listing                 |
| `DELETE` | `/api/v1/equipments/:id`              | Delete listing                 |
| `GET`    | `/api/v1/categories`                  | Home categories                |
| `GET`    | `/api/v1/reviews`                     | Home reviews                   |
| `GET`    | `/api/v1/owner/rentals`               | Owner rentals and stats        |
| `GET`/`PATCH` | `/api/v1/owner/profile`         | Owner profile                  |
| `GET`    | `/api/v1/owner/revenue`               | Revenue chart                  |
| `GET`/`POST` | `/api/v1/customer/favorites`     | Save/list favorites            |
| `DELETE` | `/api/v1/customer/favorites/:equipmentId` | Remove favorite         |
| `GET`/`POST` | `/api/v1/customer/bookings`     | Create/list bookings           |
| `GET`    | `/api/v1/customer/bookings/:id`       | Payment summary                |
| `GET`/`PATCH` | `/api/v1/profile?userId=`        | Shared account profile         |
| `GET`    | `/api/v1/admin/users`                 | Admin users table         |
| `PATCH`  | `/api/v1/admin/users/:id/role`         | Change user role          |
| `DELETE` | `/api/v1/admin/users/:id`              | Delete user + auth records|
| `GET`    | `/api/v1/admin/equipments`             | Admin equipment table     |
| `PATCH`  | `/api/v1/admin/equipments/:id/status`  | Approve / reject          |
| `GET`    | `/api/v1/admin/rentals`                | Admin rentals table       |
| `PATCH`  | `/api/v1/admin/rentals/:id/status`     | Manage booking statuses   |

MongoDB collections: `equipments`, `rentals`, `ownerProfiles`, `userProfiles`,
`categories`, `reviews`, `favorites`, `bookings`.

Bookings validate dates and available quantity, calculate `days × units × quantity`
(units = days for daily, weeks for weekly, months for monthly), reserve the units,
and also insert a rental row so it appears in the owner dashboard.

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

### Backend

In `equipment-rental-platform-server`, create `.env`:

```bash
PORT=5000
DB_URL="mongodb://localhost:27017"
```

```bash
npm install
npm run seed       # inserts 6 categories and 4 reviews (once)
npm run seed:demo  # optional: dummy users, equipment, rentals, bookings, payments, favorites
npm run dev        # http://localhost:5000
```

### Front-end

In `equipment-rental-platform`, create `.env`:

```bash
DB_URL="mongodb://localhost:27017"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
# Optional — defaults to http://localhost:5000
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

```bash
npm install
npm run dev      # http://localhost:3000
```

> Start the backend first for live data. If it is offline, pages still load with
> empty states; create/save actions will show a connection error. Log in before
> opening equipment details, favorites or payment pages.

### Scripts

| Front-end         | Backend              |
| ----------------- | -------------------- |
| `npm run dev`     | `npm run dev`        |
| `npm run build`   | `npm run build`      |
| `npm run start`   | `npm run start`      |
| `npm run lint`    | `npm run typecheck`  |
|                   | `npm run seed` / `seed:demo` |

---

## Roadmap

- [x] Public home, catalog, details, favorites and booking flow.
- [x] Seed categories and reviews from MongoDB.
- [x] Owner and admin dashboards fully backed by the API.
- [x] Customer My Rentals, favorites table and shared profile page.
- [x] Loading skeleton, error page and 404 page.
- [x] Stripe Checkout with payment verification and transaction recording.
- [ ] Add server-side auth/role guards for private routes.
- [ ] Add image uploads and email notifications.
- [ ] Add automated tests.
