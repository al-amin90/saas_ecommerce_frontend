# AGENTS.md

## Next.js version

This is **Next.js 16** with **React 19**. APIs and file structure differ from earlier versions. Read guides in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices there.

## Commands

- `npm run dev` — start dev server on port 3000
- `npm run build` — production build
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`)
- No test or typecheck scripts are defined

## Path aliases

`@/*` maps to the project root (see `tsconfig.json:22`). Code uses two patterns:

- `@/src/...` for src-level imports (e.g. `@/src/redux/api/baseApi`)
- `@/lib/utils` for root-level `lib/`

Both work. Match the convention of the file you are editing.

## Project layout

There are **two `components/` directories**:

| Path | Contents |
|---|---|
| `components/ui/` (root) | shadcn/ui primitives (button, dialog, etc.) — installed here |
| `src/components/` | Feature components: `dashboard/`, `home/`, `shared/` |

Root-level `lib/` holds shared types (`lib/types.ts`) and the `cn()` utility (`lib/utils.ts`).

Route groups use parentheses-based layouts in `src/app/`:
- `(dashboard)/` — admin dashboard, protected by middleware
- `(AuthLayout)/` — login, signup
- `(LandingLayout)/` — storefront pages (home, cart, products, order-success, track-order)

## Backend integration

- API base: `NEXT_PUBLIC_Backend_SITE_URL` env var (e.g. `https://api.kidshutbd.com`)
- RTK Query base URL: `${NEXT_PUBLIC_Backend_SITE_URL}/api/v1`
- Multi-tenancy: `NEXT_PUBLIC_TENANCY_TYPE` env var (`"single"` or `"multi"`)
  - Single mode: fixed tenant ID `"bazar"`
  - Multi mode: tenant extracted from subdomain via `x-tenant` header
- Auth token stored in Redux `persist:auth` and read from `localStorage` for SSR

## Key patterns

- **Redux store**: `src/redux/store.ts` — auth and cart slices are persisted via `redux-persist`
- **API slices**: each feature injects endpoints into `baseApi` via `injectEndpoints`. Add new endpoints in `src/redux/features/<feature>/`
- **shadcn/ui**: components are in `components/ui/`. Run `npx shadcn add <component>` to add new ones. Config in `components.json` (style: `radix-nova`)
- **Tailwind v4** with PostCSS plugin (`postcss.config.mjs`). Custom animations defined in `tailwind.config.js`
- **Middleware** at project root (`middleware.ts`) — protects `/dashboard/*` routes, redirects unauthenticated users to `/login`
- **Sonner** for toast notifications — `<Toaster>` is mounted in `src/app/layout.tsx`

## Gotchas

- `src/modules/` contains `doctor/` and `patient/` directories that appear to be leftover boilerplate — do not reference them
- `.env` is committed with config but `.gitignore` excludes `.env*`. Use `.env.local` for local overrides
- `components/ui/` lives at project root, not inside `src/`. When importing shadcn components from within `src/`, use `@/components/ui/...`
