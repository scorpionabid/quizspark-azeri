# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run lint         # ESLint check
npx tsc --noEmit    # Type check without emitting files

# Docker (preferred development environment)
docker-compose up -d           # Start dev container on localhost:3005
docker-compose down            # Stop container
docker-compose up -d --build   # Rebuild and start

# Run lint/typecheck inside Docker
docker exec quiz_app_container npm run lint
docker exec quiz_app_container npx tsc --noEmit
```

## Mandatory Quality Gates

After every code change, both of these must pass with zero errors before considering a task complete:

1. `npm run lint` — ESLint
2. `npx tsc --noEmit` — TypeScript type checking

If a change causes type errors or lint failures anywhere in the codebase (not just the files modified), fix them all before finishing.

## Architecture

**Stack**: React 18 + TypeScript + Vite + Supabase + Shadcn UI + TanStack React Query

**Backend**: Supabase handles auth, database (PostgreSQL), and serverless edge functions (Deno). The client is initialized in [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts). Database types are auto-generated in [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts).

**Auth & Roles**: [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx) is the central auth state provider. It fetches the user's role from the `user_roles` table after login. Three roles exist: `admin`, `teacher`, `student` (defined in [src/types/auth.ts](src/types/auth.ts)). `ProtectedRoute` in [src/components/auth/](src/components/auth/) gates routes by role.

**Data Fetching Pattern**: All server state uses TanStack React Query via custom hooks in [src/hooks/](src/hooks/). Each domain has its own hook (e.g., `useQuizzes`, `useQuestions`, `useUsers`). Direct Supabase calls belong inside these hooks, not in components or pages.

**Routing**: Defined in [src/App.tsx](src/App.tsx). Public routes, role-specific protected routes (admin, teacher, student), and a catch-all 404.

**Edge Functions**: Located in [supabase/functions/](supabase/functions/). Key functions: `generate-quiz`, `ai-chat`, `process-document`, `enhance-question`, `ai-config`. Note: `verify_jwt = false` is set globally in `supabase/config.toml`.

**UI Components**: Shadcn UI primitives live in [src/components/ui/](src/components/ui/). Feature components are organized by domain under [src/components/](src/components/) (e.g., `quiz/`, `admin/`, `teacher/`). Pages are in [src/pages/](src/pages/).

**Styling**: Tailwind CSS with custom design tokens in [tailwind.config.ts](tailwind.config.ts). Use the `cn()` utility from [src/lib/utils.ts](src/lib/utils.ts) to merge class names.

## Database Migrations

Migration files go in [supabase/migrations/](supabase/migrations/) with the naming convention `YYYYMMDDHHMMSS_description.sql`.

## Key Conventions

- Path alias `@/` maps to `src/` (configured in [vite.config.ts](vite.config.ts) and [tsconfig.json](tsconfig.json))
- Before creating a new hook, component, or utility, search for existing implementations to avoid duplication
- Business logic belongs in hooks (`src/hooks/`), not in page components
