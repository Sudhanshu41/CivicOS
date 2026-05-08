# CivicOS — Frontend Runtime Diagnostics

## Build System
- **Framework**: Next.js 16.2.6 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Package Manager**: npm

## Startup & Execution
- **Command**: `npm run dev`
- **Port**: 3000 (Default)
- **Environment**: Development mode is primary for visualization prototyping.

## Core Capabilities
- **WebSocket Support**: Native browser `WebSocket` API is compatible. No external library (like Socket.io) is currently required if the backend uses standard WebSockets.
- **Animation Performance**: `Framer Motion` 12 handles high-frequency state updates efficiently via hardware acceleration.
- **Graphing**: `@xyflow/react` is the production-grade engine for the orchestration graph.

## Tooling & Linting
- **ESLint**: Standard Next.js config (`eslint-config-next`).
- **PostCSS**: Configured for Tailwind 4.
- **Strict Typing**: Fully implemented for props and state.

## Connectivity Status
- **Backend URL**: Currently unset (defaults to localhost:8000 in upcoming phase).
- **CORS**: Next.js dev server may need Proxy configuration or explicit CORS headers from the Python backend (FastAPI).
- **Persistence**: Local storage is currently not used for workflow state; all state is ephemeral.
