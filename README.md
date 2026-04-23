# NanoPay Platform

NanoPay Platform is a Next.js + TypeScript application for agent onboarding, wallet operations, micropayments, and transaction tracking.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Drizzle ORM
- Circle APIs (wallets, bridge, payments)
- x402 facilitator integration

## Prerequisites

- Node.js 18+
- npm 9+

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy environment template:

```bash
copy .env.local.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev` - start local development server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run ESLint checks

## Project Structure

- `src/app` - application routes, API handlers, and pages
- `src/components` - reusable UI components
- `src/lib` - business logic, integrations, security, and data access
- `scripts` - utility and workflow scripts
- `contracts` - smart contract sources and compiled artifacts

## Notes

- Keep secrets in local environment files and never commit them.
- Use `src/lib` as the primary home for integrations and shared server logic.

## License

Private repository.
