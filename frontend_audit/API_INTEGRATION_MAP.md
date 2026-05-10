# CivicOS — API Integration Map

## Current Status: **STATIC ONLY**

The frontend currently uses static mock data for all views. No network requests are being made to the backend.

## Required API Endpoints (Target)
- **POST `/api/v1/civic-issues/analyze`**: To trigger the AI pipeline.
- **GET `/api/v1/workflows/{id}`**: To fetch historical execution data.
- **GET `/api/v1/system-events`**: To populate the main dashboard feed.

## Recommended Integration Architecture

### 1. API Client (`src/lib/api.ts`)
Implement a structured client using `fetch` or `axios` with:
- **Base URL**: `process.env.NEXT_PUBLIC_API_URL`
- **Request ID**: Injection of `X-Request-ID` for cross-stack tracing.
- **Global Error Handling**: Integration with UI error boundaries.

### 2. Request Lifecycle
- **Loading States**: Use existing `GlassPanel` loading skeletons.
- **Success Handling**: Trigger the WebSocket subscription upon receiving a `202 Accepted` from the `/analyze` endpoint.

## Environment Configuration
The frontend needs a `.env.local` with:
- `NEXT_PUBLIC_API_URL`: Backend REST root.
- `NEXT_PUBLIC_WS_URL`: Backend WebSocket root.

## Missing Components
- **API Wrapper**: No standardized fetcher.
- **Mutation Hooks**: No `useMutation` (e.g., via TanStack Query) to manage the execution trigger.
- **Error Boundaries**: Basic Next.js `error.tsx` exists, but domain-specific boundaries are missing.
