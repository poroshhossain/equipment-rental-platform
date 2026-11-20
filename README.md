# EquipRent — Equipment Rental Platform

A Next.js + Express equipment rental marketplace. Owners manage listings, rentals
and their profile from a role-aware dashboard; data is stored in MongoDB and served
by a small Express API.

> **Current stage:** the owner dashboard is wired to the backend. Equipment, rentals,
> owner profile and revenue all come from the API — there is no mock data in the
> front-end. Bookings are not created anywhere yet, so the rentals/revenue views stay
> empty until rental records are added to MongoDB.

---

## Tech Stack

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Frontend   | Next.js 16 (App Router, Cache Components, Turbopack) |
| Language   | TypeScript                                        |
| Styling    | Tailwind CSS v4 + shadcn/ui (base-ui primitives)  |
| Auth       | better-auth (email/password + Google)             |
| Forms      | React Hook Form + Zod                             |
| Backend    | Express 5 + MongoDB (separate project)            |
| Icons      | lucide-react                                      |
| Toasts     | Sonner                                            |

---

## Projects

| Path                                                                     | What it is                          |
| ------------------------------------------------------------------------ | ----------------------------------- |
| `C:\Projects\a\a9\equipment-rental-platform`                              | Next.js front-end (this project)    |
| `C:\Projects\a\a9\equipment-rental-platform-server`                       | Express + MongoDB API               |

Both projects connect to the same MongoDB database (`equipment-rental-platform`).

---

## Features

### Owner Dashboard

- **Overview** — stats, 6-month revenue chart, recent rentals, pending-review queue
  and quick actions, all from the API.
- **Add Equipment** — validated listing form (name, description, category, brand,
  model, location, price, rental type, quantity, condition, image URL, terms).
- **My Equipment** — searchable/filterable table of live listings with details,
  update and delete actions.
- **My Equipment Rental** — table of bookings with payment and booking status.
- **My Profile** — editable owner profile saved through the API.

### Dashboard Shell

- Collapsible sidebar, role-aware navigation and sticky header.
- better-auth session used for sign-out and the role chip.

### Public Site & Auth

- Landing page shell, public header/navbar, login and registration screens with
  validation and Google sign-in.

---

## Routes

| Route                               | Description                        |
| ----------------------------------- | ---------------------------------- |
| `/`                                 | Public landing page                |
| `/login`, `/register`               | Authentication screens             |
| `/dashboard/owner`                  | Owner overview                     |
| `/dashboard/add-equipment`          | Create a new equipment listing     |
| `/dashboard/my-equipment`           | Owner's equipment table            |
| `/dashboard/my-equipment/[id]/edit` | Update a listing                   |
| `/dashboard/my-equipment-rentals`   | Rentals/bookings for owner gear    |
| `/dashboard/my-profile`             | Owner profile                      |
| `/dashboard/customer`               | Customer dashboard (placeholder)   |
| `/dashboard/admin`                  | Admin dashboard (placeholder)      |

---

## Project Structure

```
equipment-rental-platform/
├── src/
│   ├── app/
│   │   ├── (auth)/                     # Login & register
│   │   ├── (dashboard)/dashboard/      # Owner pages + dashboard shell
│   │   ├── (public)/                   # Landing page
│   │   └── api/auth/[...all]/          # better-auth handler
│   ├── components/                     # auth, dashboard, public, ui
│   ├── hooks/                          # use-mobile
│   └── lib/
│       ├── api/ownerAction.ts          # All backend requests + data normalization
│       ├── auth.ts / auth-client.ts    # better-auth config
│       ├── dashboard-nav.ts            # Role-based navigation config
│       ├── format.ts                   # Currency, date and initial helpers
│       ├── types.ts                    # Shared types, options and status labels
│       └── validations/                # Zod schemas (auth, equipment)
└── README.md

equipment-rental-platform-server/
└── src/
    ├── app.ts                          # Express app and route mounting
    ├── server.ts                       # Starts the server on PORT
    ├── config/db.ts                    # MongoDB connection
    └── modules/
        ├── users/                      # GET /api/v1/users
        └── owner/
            ├── equipment/              # GET/POST/PATCH/DELETE equipments
            ├── rental/                 # GET owner rentals
            ├── profile/                # GET/PATCH owner profile
            └── revenue/                # GET 6-month revenue from paid rentals
```

---

## Backend API

The front-end calls the API through `src/lib/api/ownerAction.ts`. The backend sends
plain objects with an `id` field and the client only unwraps
`{ success, message, data }`. If the API is offline, reads return empty lists so pages
still render with empty states.

| Method   | Endpoint                    | Used by                         |
| -------- | --------------------------- | ------------------------------- |
| `GET`    | `/api/v1/equipments`        | Overview, My Equipment, edit, profile stats |
| `POST`   | `/api/v1/equipments`        | Add Equipment                   |
| `PATCH`  | `/api/v1/equipments/:id`    | Update listing                  |
| `DELETE` | `/api/v1/equipments/:id`    | Delete listing                  |
| `GET`    | `/api/v1/owner/rentals`     | Rentals table, profile stats    |
| `GET`    | `/api/v1/owner/profile`     | Owner name, profile form        |
| `PATCH`  | `/api/v1/owner/profile`     | Save profile                    |
| `GET`    | `/api/v1/owner/revenue`     | Overview revenue chart          |

MongoDB collections: `equipments`, `rentals`, `ownerProfiles` (single owner document).
The revenue endpoint sums `bookingAmount` from rentals with `paymentStatus: "paid"`
over the last six calendar months.

---

## Getting Started

### Prerequisites

- Node.js 20+
- A running MongoDB instance (local or Atlas)

### Backend setup

In `equipment-rental-platform-server`, create `.env`:

```bash
PORT=5000
DB_URL="mongodb://localhost:27017"
```

Then run:

```bash
npm install
npm run dev        # http://localhost:5000
```

### Front-end setup

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

Then run:

```bash
npm install
npm run dev        # http://localhost:3000
```

> Start the backend first to see live data. If it is not running, the dashboard still
> loads with empty states; create/update/save actions will show a connection error.

### Scripts

**Front-end**

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

**Backend**

```bash
npm run dev        # Dev server with reload
npm run build      # Compile TypeScript to dist/
npm run start      # Production server
npm run typecheck  # Type check only
```

---

## Roadmap

- [x] Load, create, update and delete equipment through the API.
- [x] Serve rentals, owner profile and revenue from the backend.
- [ ] Add a booking flow that creates rental records.
- [ ] Add server-side auth/role guards for dashboard routes.
- [ ] Complete the customer dashboard (browse, favorites, checkout).
- [ ] Complete the admin dashboard (users, approvals, reports).
- [ ] Connect image uploads and payment status updates.
- [ ] Add automated tests for forms, tables and endpoints.
