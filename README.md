# BookNgo Frontend

Next.js admin dashboard for hotel reservation management.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Library:** shadcn/ui (Radix primitives)
- **Charts:** Recharts
- **Auth:** Laravel Sanctum (token-based, httpOnly cookies)
- **Testing:** Jest + React Testing Library

## Project Structure

```
src/
├── __tests__/           # Test files (49 tests)
├── app/
│   ├── (public)/        # Public pages (Navbar + Footer)
│   │   ├── hotels/
│   │   └── page.tsx
│   ├── admin/           # Admin pages (AdminSidebar, dark theme)
│   │   ├── dashboard/
│   │   ├── hotels/
│   │   ├── new-hotel/
│   │   ├── reservations/
│   │   ├── users/
│   │   └── login/
│   ├── globals.css
│   └── layout.tsx
├── components/          # Shared components
│   ├── ui/              # shadcn/ui primitives
│   ├── AdminSidebar.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── StatsCard.tsx
├── lib/
│   ├── api.ts           # Axios instance + interceptors
│   └── store.ts         # Zustand auth store
└── middleware.ts        # Route protection
```

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npm test           # Run tests
npm run test:ui    # Watch mode
npm run coverage   # Coverage report
```

## Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
