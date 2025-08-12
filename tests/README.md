# Tests

This folder contains test infrastructure and suites used across the project.

## Structure
- unit/  fast unit tests (Vitest)
- ui/  Playwright UI tests (runs against dev or mocked APIs)
- verification/  PRD traceability tests (TC001+)
- utils/  shared helpers (MSW server, test setup)
- scripts/  test assets/fixtures and helper scripts

## Commands
- npm run test:unit  run Vitest unit tests (jsdom for React when needed)
- npm run test:ui  run Playwright tests
- npm run test:all  run unit then UI suites

See also: playwright.config.ts and vitest.config.ts at project root.
