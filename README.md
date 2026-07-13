# Food Delivery

A food delivery web app frontend — customers browse restaurants and order food, restaurant owners manage their menu and incoming orders, couriers claim and deliver orders, and admins oversee users and orders platform-wide.

The frontend talks to four independent backend microservices (auth, orders, restaurants/menu, notifications), each maintained separately.

## Tech Stack

- **[Vue 3](https://vuejs.org/)** — Composition API, `<script setup>`
- **[TypeScript](https://www.typescriptlang.org/)** — the entire codebase is typed
- **[Vite](https://vitejs.dev/)** — dev server and build tool
- **[Vue Router](https://router.vuejs.org/)** — routing with role-based route guards
- **[Pinia](https://pinia.vuejs.org/)** — client state (auth session, cart)
- **[TanStack Query](https://tanstack.com/query/latest/docs/framework/vue/overview)** — server state, caching, and data fetching (replaces manual `ref` + `loading`/`error` flags)
- **[Axios](https://axios-http.com/)** — HTTP client, with interceptors for auth headers and automatic token refresh
- **[Tailwind CSS v4](https://tailwindcss.com/)** — styling
- **[Lucide](https://lucide.dev/)** — icons (`@lucide/vue`)

## Roles & Features

The app has five user roles, each with its own set of routes (enforced by `router/index.ts`):

| Role | What they can do |
|---|---|
| **Customer** | Browse/search restaurants, view menus, add to cart, check out, track order status, view notifications |
| **Courier** | View available (unclaimed) orders, claim a delivery, update status through delivery, view delivery history |
| **Restaurant Owner** | Create/manage their own restaurant(s), menu items, item categories, ads; view and progress orders placed against their restaurant |
| **Admin** | Manage all users (activate accounts, change roles, deactivate/delete non-admin users), oversee all orders across every restaurant, manage restaurants platform-wide |
| **Superadmin** | Same as Admin, plus creating other Admin accounts (self-service admin creation is intentionally not exposed in the UI — see note below) |

**Registration flow:** email → OTP verification → account details. Customer registration is instant (auto-logged-in on success). Courier and Restaurant Owner registrations require manual activation by an Admin before the account can log in.

## Project Structure

```
src/
├── main.ts                 # App entry point — wires up Pinia, Router, TanStack Query
├── App.vue                 # Root component (just <router-view/>)
├── queryClient.ts          # Shared TanStack Query cache config
├── router/index.ts         # Routes + auth/role guard (beforeEach)
├── stores/                 # Pinia stores
│   ├── auth.ts             #   session (tokens, current user, login/logout/refresh)
│   └── cart.ts             #   shopping cart (persisted to localStorage)
├── api/                    # One file per backend service — typed request/response shapes
│   ├── http.ts             #   axios instances + auth header/token-refresh interceptors
│   ├── auth.ts              #   auth service (login, register, OTP, /me)
│   ├── users.ts             #   auth service (users, roles, admins, customers, couriers, owners)
│   ├── order.ts             #   order service (orders, courier assignment)
│   ├── restaurant.ts        #   restaurant service (restaurants, menu, categories, ads, search)
│   ├── notification.ts      #   notification service
│   └── queryKeys.ts         #   centralized TanStack Query cache keys
├── views/                  # Route-level pages, organized by role
│   ├── auth/                #   sign in / sign up
│   ├── customer/            #   restaurants, cart, orders, notifications
│   ├── owner/                #   restaurant/menu management, owner orders
│   ├── admin/                #   user management, order oversight
│   └── courier/              #   delivery pool, courier orders
├── components/              # Shared UI (layouts, header, cart drawer, etc.)
├── composables/             # Reusable Vue composition functions
├── constants/                # Static values (e.g. order status labels/colors)
└── utils/                    # Helpers (e.g. JWT decode/expiry check)
```

## Getting Started

### Prerequisites

- Node.js (see `package.json` for tooling versions)
- Access to the four backend services (see Environment Variables below)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the base URL for each backend service:

```
VITE_AUTH_URL=            # auth service — login, register, users, roles
VITE_ORDER_URL=           # order service — orders, courier assignment
VITE_RESTAURANT_URL=      # restaurant service — restaurants, menu, categories, ads
VITE_NOTIFICATION_URL=    # notification service
```

`.env` is git-ignored — never commit it.

### Development

```bash
npm run dev
```

Starts the Vite dev server on `http://localhost:5173`.

### Build

```bash
npm run build
```

Type-checks (`tsc`) then builds for production into `dist/`.

### Preview a production build

```bash
npm run preview
```

## Notes

- **Backend is split across 4 independent microservices**, each with its own OpenAPI/Swagger docs (check `/docs`, `/v3/api-docs`, or `/openapi.json` on each service's base URL). The frontend types in `src/api/*.ts` mirror those specs — if a backend contract changes, update the corresponding types there.
- **JWT payload quirk:** the token only carries `user_id` (not `id`). Code that needs the current user's numeric id falls back with `authStore.user?.id ?? authStore.user?.user_id`.
- **Admin creation is intentionally restricted:** the UI doesn't expose self-service admin creation/deletion — the backend also restricts creating new admins to Superadmin accounts.
