# EquipRent — Equipment Rental Platform

A Next.js + Express equipment rental marketplace. Visitors browse equipment,
logged-in customers save favorites and book gear, and owners manage their fleet
from a role-aware dashboard. All records live in MongoDB behind a small Express API.

> **Current stage:** public home/catalog, details, favorites, booking flow and owner
> dashboard are wired to the API. The payment page is a booking summary only — no
> payment gateway is connected yet.

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
- **Catalog** (`/equipments`) — search, category filter and approved listings.
- **Footer** — navigation, account links and contact anchor.

### Customer (private)

- **Equipment details** — image, full information, rental terms, owner details,
  add/remove favorites and a **Book now** modal.
- **Booking modal** — start/end date, quantity, contact number, delivery address
  and notes. The total is calculated from rental duration × rental type × quantity.
  Availability is checked on the server and units are reserved.
- **Payment page** — booking summary with the saved total and a clear notice that
  gateway integration is not connected yet.
- **Favorites** — saved in MongoDB and listed in `/dashboard/favorites` with a
  remove action.

### Owner Dashboard

- Overview stats, 6-month revenue chart, rentals, pending-review queue.
- Add / update / delete equipment, searchable equipment table, editable profile.

### Dashboard Shell

- Collapsible sidebar, role-aware navigation, sticky header and session sign-out.

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
| `/dashboard/favorites`              | Saved favorites                          |
| `/dashboard/owner`                  | Owner overview                           |
| `/dashboard/add-equipment`          | Create a listing                         |
| `/dashboard/my-equipment`           | Owner equipment table                    |
| `/dashboard/my-equipment/[id]/edit` | Update a listing                         |
| `/dashboard/my-equipment-rentals`   | Owner rentals                            |
| `/dashboard/my-profile`             | Owner profile                            |
| `/dashboard/admin`                  | Admin dashboard (placeholder)            |

---

## Project Structure

```
equipment-rental-platform/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Login & register
│   │   ├── (dashboard)/dashboard/     # Owner/customer pages + shell
│   │   ├── (public)/                  # Home, catalog, details, payment
│   │   └── api/auth/[...all]/         # better-auth handler
│   ├── components/
│   │   ├── public/
│   │   │   ├── header/               # Navbar, logo
│   │   │   ├── footer/               # Site footer
│   │   │   ├── home/                 # Banner, cards, categories, sections
│   │   │   ├── equipment/            # Details, booking modal, payment summary
│   │   │   └── AuthGuard.tsx         # Redirects logged-out visitors
│   │   ├── dashboard/                # Dashboard shell + owner/customer views
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
        └── customer/                 # Favorites + bookings
```

---

## Backend API

The client unwraps the standard `{ success, message, data }` envelope. Reads fall
back to empty values if the API is offline; writes show a connection error.

| Method   | Endpoint                              | Used by                        |
| -------- | ------------------------------------- | ------------------------------ |
| `GET`    | `/api/v1/equipments?status=&limit=&sort=` | Home, catalog, dashboard   |
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

MongoDB collections: `equipments`, `rentals`, `ownerProfiles`, `categories`,
`reviews`, `favorites`, `bookings`.

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
npm run seed     # inserts 6 categories and 4 reviews (once)
npm run dev      # http://localhost:5000
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
|                   | `npm run seed`       |

---

## Roadmap

- [x] Public home, catalog, details, favorites and booking flow.
- [x] Seed categories and reviews from MongoDB.
- [x] Owner dashboard fully backed by the API.
- [ ] Connect a real payment gateway on `/payment`.
- [ ] Add customer "My rentals" page.
- [ ] Add server-side auth guards for private routes.
- [ ] Add image uploads and admin approval UI.
- [ ] Add automated tests.
