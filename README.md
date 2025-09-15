# EchoGrow Monorepo

## Getting Started

### Install dependencies

```
pnpm install
```

### Run the Frontend (Next.js)

```
pnpm --filter web dev
```

### Run the Backend (API/Server)

- API routes are in `packages/backend/api/`.

### Run Tests (Vitest)

```
pnpm test
```

- Unit and integration tests live under `tests/` and package-specific `__tests__`.

## Month 2 Features

- Schedule Post enhancements, Analytics Dashboard, AI caption + translation.

## Month 3 Features

- AI Flows: `viralPredictor.ts`, `sentimentAnalysis.ts`, `smartRepurposing.ts`
- Backend APIs: `viralPredictor.ts`, `sentiment.ts`, `repurposing.ts`
- Frontend components: `PredictedEngagement.tsx`, `SentimentTrend.tsx`, `RepurposedPostSuggestions.tsx`
- Tests: Unit and integration skeletons for all features

## Security & Observability

- Secrets via env or Vault (`.env.example` provided)
- Trace ID logging in backend routes and AI flows

## Testing & Coverage

- Use Vitest for unit/integration/e2e
- Placeholder tests scaffolded; aim for ≥80% coverage per `.cursorrules`
