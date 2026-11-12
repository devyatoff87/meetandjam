# MeetAndJam

A platform for discovering and organizing music jam sessions and other events (theater, stand-up, dance, spoken word). Organizers publish events; musicians and participants find them and join.

**Status:** MVP in active development.

---

## Tech Stack

**Frontend:**

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui
- TanStack Query (server state)
- React Hook Form + Zod (validation)
- Vitest + React Testing Library

**Backend:**

- Fastify
- TypeORM + PostgreSQL
- Zod (validation)
- JWT (Bearer)

---

## Architecture

Feature-based structure: code is grouped by business domain, not by file type. Each `features/<domain>/` folder holds that domain's components, hooks, services, schemas, and types.

```text
frontend/src/
├── app/          # Next.js App Router (routes, pages, layouts)
├── features/     # Business domains (auth, events, participants)
├── components/   # UI components (ui/ — shadcn, shared/ — common)
└── lib/          # Infrastructure (api, auth, utils, env)
```
