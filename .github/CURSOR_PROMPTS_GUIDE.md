# EchoGrow – Cursor AI Prompts Starter Guide

## 📌 Table of Contents
1. General Guidelines
2. UI / Frontend Prompts
3. Backend / API Prompts
4. AI / Hugging Face Integration Prompts
5. Full Feature / Flow Prompts
6. Month 1 – Setup & Foundations
7. Month 2 – Core Features
8. Month 3 – AI Differentiators
9. Month 4 – Polish & Launch
10. Testing Prompts
11. Best Practices

---

## 1️⃣ General Guidelines

- Always follow the **`.cursorrules`** file.
- Generate **small PR-sized outputs** (≤400 LOC) per prompt.
- Include **file paths, exact code blocks, and explanations** for each feature.
- Ensure **unit tests, integration tests, and e2e tests** are included when generating code.
- Maintain **multi-language/i18n readiness** for all UI and AI components.
- Enforce **security, observability, and performance** rules in all generated code.
- Include **loading states, skeleton screens, and error fallbacks** in UI components.
- Follow workflow: Plan → Implement → Test → Document.

---

## 2️⃣ UI / Frontend Prompts

### Generate a React Page
```text
Path: apps/web/pages/schedule.tsx
Prompt:
"Generate a Next.js + Tailwind page for EchoGrow that shows scheduled posts in a calendar view.
- Use TypeScript for all props and state.
- Use React Query to fetch posts from backend.
- Add skeleton loaders for async data.
- Multi-language support using i18next.
- Include unit tests using Vitest.
- Follow accessibility (WCAG 2.1 AA) and responsive design standards."
Generate a Reusable Component
text
Copy code
Path: apps/web/components/CaptionPreview.tsx
Prompt:
"Generate a reusable React component for AI-generated social media caption preview.
- Props: text, language, sentimentScore.
- Include TypeScript typing.
- Skeleton loader and error fallback included.
- Keyboard and screen reader accessible.
- Include unit tests."
Generate a Dashboard Page
text
Copy code
Path: apps/web/pages/analytics.tsx
Prompt:
"Generate a Next.js analytics dashboard page:
- Show likes, shares, comments, AI engagement predictions.
- Use React Query for API data fetching.
- Charts implemented with D3.js.
- Loading states, fallback UI, and skeleton loaders included.
- Multi-language support enabled.
- Include unit tests."
3️⃣ Backend / API Prompts
Generate an API Route
text
Copy code
Path: packages/backend/api/posts.ts
Prompt:
"Generate a TypeScript API route in Next.js for scheduling social media posts:
- Validate request body using zod.
- Authenticate users via JWT.
- Store posts in Supabase/Postgres.
- Include error handling and logging.
- Include unit and integration tests.
- Follow EchoGrow .cursorrules."
Generate a Background Worker
text
Copy code
Path: packages/backend/jobs/sendPostJob.ts
Prompt:
"Generate a Node.js background job for sending scheduled posts to Twitter:
- Retry on failure with exponential backoff.
- Log events with OpenTelemetry traceId.
- Use DLQ (Redis/S3) for failed jobs.
- Include unit tests.
- Secure API keys via Vault or environment."
4️⃣ AI / Hugging Face Integration Prompts
Generate AI Caption
text
Copy code
Path: packages/ai-flows/captionGeneration.ts
Prompt:
"Generate a TypeScript function to create AI-powered captions:
- Input: post text, language preference.
- Output: generated caption + sentiment score.
- Use Hugging Face free models.
- Include caching for repeated requests.
- Include unit tests.
- Follow security and observability rules."
Translate Captions
text
Copy code
Path: packages/ai-flows/translation.ts
Prompt:
"Generate a TypeScript function to translate captions into multiple languages:
- Use Hugging Face translation models.
- Ensure output is safe for social media.
- Include unit tests.
- Integrate with frontend i18n."
Predict Engagement
text
Copy code
Path: packages/ai-flows/engagementPredictor.ts
Prompt:
"Generate a function to predict post engagement:
- Input: historical metrics + post content.
- Output: engagement score and viral probability.
- Include unit tests and logging.
- Async/await used throughout.
- Monitor AI performance metrics."
5️⃣ Full Feature / Flow Prompts
End-to-End Flow
text
Copy code
Prompt:
"Generate a full EchoGrow flow:
1. User schedules post via UI.
2. Backend validates and stores post.
3. AI generates caption and translations.
4. Post sent to Twitter/X API on schedule.
5. Track engagement metrics.
6. Display results in analytics dashboard.
- Include Next.js pages, React components, API routes, and background jobs.
- Include unit, integration, and e2e tests.
- Multi-language support enabled.
- Follow .cursorrules for workflow, security, and observability."
6️⃣ Month 1 – Setup & Foundations
Project scaffolding & folder structure (Monorepo with apps/web, packages/backend, packages/ai-flows, tests/)

Supabase DB + Auth integration

React + Tailwind boilerplate

Twitter/X API connection (initial platform)

Stripe subscription integration

Unit test skeletons for auth, layout, posts, subscriptions

7️⃣ Month 2 – Core Features
Schedule Post page + calendar view

Analytics Dashboard page

AI-powered caption generation

AI-powered caption translation

Unit & integration test skeletons

Small PR scaffold prompts for incremental delivery

8️⃣ Month 3 – AI Differentiators
Viral Predictor (engagement prediction)

Sentiment Analysis (audience mood tracker)

Smart Repurposing (post conversion suggestions)

Unit & integration test skeletons

Small PR scaffold prompts

9️⃣ Month 4 – Polish & Launch
Multi-language UI with React-i18next

Marketing site + landing page

Final frontend/backend polish

Deployment: Vercel + Supabase

Beta launch with early adopters

Full unit, integration, E2E test coverage

10️⃣ Testing Prompts
Unit Test Prompt
text
Copy code
Path: tests/unit/[filename].test.ts
Prompt:
"Generate unit tests for [function/component name] in EchoGrow:
- Use Vitest as the test runner.
- Mock external dependencies.
- Validate edge cases, success, and failure paths.
- Ensure TypeScript types are respected.
- Follow EchoGrow .cursorrules for testing coverage (≥80%)."
Integration Test Prompt
text
Copy code
Path: tests/integration/[api-or-service].test.ts
Prompt:
"Generate integration tests for [API route or service] in EchoGrow:
- Use Vitest or Supertest (for API endpoints).
- Validate request/response flows end-to-end (DB + API).
- Test JWT authentication and RBAC enforcement.
- Ensure observability hooks (logs/traces) are triggered.
- Cover error handling, retries, and fallback paths."
End-to-End (E2E) Test Prompt
text
Copy code
Path: tests/e2e/[feature].test.ts
Prompt:
"Generate end-to-end tests for [feature name] in EchoGrow:
- Use Playwright for UI automation.
- Cover main user journeys (schedule post → AI caption → publish → analytics dashboard).
- Validate UI accessibility (keyboard navigation, ARIA labels).
- Mock external APIs (Twitter/X, Hugging Face) with test fixtures.
- Include multi-language/i18n scenarios.
- Capture screenshots on failure for debugging."
Load & Performance Test Prompt
text
Copy code
Path: tests/performance/[scenario].test.ts
Prompt:
"Generate load and performance tests for [feature or API] in EchoGrow:
- Use k6 or Artillery.
- Simulate concurrent users scheduling posts.
- Measure response times, error rates, and throughput.
- Validate system scaling with auto-scaling policies.
- Ensure performance metrics are logged to observability stack."
Chaos / Resilience Test Prompt
text
Copy code
Path: tests/chaos/[scenario].test.ts
Prompt:
"Generate resilience tests for EchoGrow services:
- Simulate DB outages, API timeouts, and network latency.
- Verify retry logic, circuit breaker, and DLQ behavior.
- Ensure no data loss and consistent recovery.
- Log all resilience events with traceIds."
11️⃣ Best Practices
Generate small, focused code blocks per PR.

Document functionality, inputs/outputs, and assumptions inline.

Include error handling, logging, and observability hooks in backend code.

Maintain accessibility and i18n support in frontend components.

Always include unit, integration, and e2e tests automatically.

AI model functions should have fallbacks to simpler/free alternatives.

Follow incremental delivery (month-wise roadmap) for predictable builds.

Apply all .cursorrules for workflow, security, coding, testing, observability, performance, and deployment.