# Startales — Local-First RPG Platform

## Quick Start (Demo)

- Run demo server: `DEMO_START=1 PORT=4011 npm run dev:demo`
- Open: `http://localhost:4011/demo/hud`, `http://localhost:4011/demo/policies`, `http://localhost:4011/demo/trade`
- Run tests: `npm run test:api` (API), `DEMO_START=1 PORT=4011 npm run e2e` (E2E)

## Environment

- Copy variables from `design/env_example.md` into a `.env.local` at repo root (do not commit).
- `OFFLINE=true` enables local-only mode and prepares deny-by-default outbound behavior (enforced in later tasks).

## Task 1 — Monorepo Scaffolding (Plan)

Acceptance (TC001–TC006) captured in `design/verification_plan.md`.

Pending next:
- Root scripts for dev/build/test/e2e/typecheck across future packages
- Workspaces: `pnpm-workspace.yaml` (added), `.editorconfig` (added), `.gitignore` (updated)
