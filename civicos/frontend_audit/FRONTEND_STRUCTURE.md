# CivicOS — Frontend Architecture Overview

## Project Structure Tree
```text
C:\USERS\HP\ANTI\CIVICOS\SRC
├───app
│   │   favicon.ico
│   │   globals.css
│   │   layout.tsx
│   │   page.tsx (Landing Page)
│   │   
│   └───dashboard
│       │   layout.tsx (Dashboard Shell)
│       │   page.tsx (Overview Dashboard)
│       │   template.tsx
│       │   
│       ├───analytics (page.tsx)
│       ├───emergency (page.tsx)
│       ├───infrastructure (page.tsx)
│       ├───issues (page.tsx)
│       ├───map (page.tsx)
│       ├───orchestration (page.tsx - Core AI Flow)
│       ├───settings (page.tsx)
│       └───traffic (page.tsx)
│               
├───components
│   ├───analytics (ConfidenceMetrics.tsx, IntelligenceCore.tsx)
│   ├───dashboard (ConsciousnessFeed.tsx, CoreVisual.tsx, TelemetryGrid.tsx, etc.)
│   ├───landing (Hero.tsx)
│   ├───layout (DashboardHeader.tsx, DashboardSidebar.tsx)
│   ├───motion (ActivityFeed.tsx, PulseIndicator.tsx, NeuralPath.tsx, etc.)
│   └───ui (GlassPanel.tsx, StatusBadge.tsx, CinematicBackground.tsx, etc.)
│           
├───hooks
│       useWorkflow.ts (Simulated workflow timer)
│       
├───lib
│       motionConfig.ts (Framer Motion constants)
│       utils.ts (Tailwind merging)
│       
└───types
        index.ts
```

## Folder Explanations
- **app/**: Next.js App Router root. Contains global styles, main layout, and all route-based pages.
- **components/**: Domain-specific and shared UI components. Organized by feature (analytics, dashboard, orchestration) and atomic type (ui, motion, layout).
- **hooks/**: Custom React hooks. Currently contains `useWorkflow` for simulated state transitions.
- **lib/**: Core utilities, configurations, and singleton instances.
- **types/**: Global TypeScript interfaces and type definitions.

## Routing Architecture
- **Next.js App Router**: Uses directory-based routing.
- **Root Layout**: Provides global context (HTML/Body/Fonts).
- **Dashboard Layout**: Implements the persistent sidebar and header shell for all authenticated views.
- **Key Route**: `/dashboard/orchestration` is the primary interface for AI agent interaction.

## Component Organization
- **Atomic-ish Design**:
  - `ui/`: Fundamental glassmorphic and cinematic building blocks.
  - `motion/`: Animation-heavy components (ActivityFeed, PulseIndicators).
  - `dashboard/`: Complex compositions for dashboard views.
  - `layout/`: High-level structural components (Sidebar, Header).

## State Management Architecture
- **Local State**: Primarily `useState` for component-level UI toggles.
- **Context/Hooks**: Simulated global state transitions via `useWorkflow`.
- **Note**: Currently lacks a global state manager (Redux/Zustand), making it highly suitable for a clean WebSocket-driven state implementation.

## Animation System
- **Framer Motion**: Used extensively for:
  - Page transitions.
  - Sidebar expansion/collapse.
  - "Pulse" effects and telemetry counters.
  - Flow diagrams and neural paths.

## WebSocket Infrastructure
- **Status**: **Missing**.
- **Audit**: There is no current WebSocket provider, hook, or client-side event bus. All "realtime" updates are currently simulated via `setInterval` in `useWorkflow`.

## API Integration Structure
- **Status**: **Missing**.
- **Audit**: No dedicated API client (Axios/Fetch wrapper) is currently implemented. The system relies on static initial data.

## Styling & Design System
- **Tailwind CSS v4**: Used for all styling.
- **Glassmorphism**: Heavy use of `backdrop-blur`, `white/5` borders, and `bg-white/[0.01]`.
- **Typography**: Inter (default Next.js) with tracking-widest and uppercase for technical technical metadata.
- **Color Palette**: Dark-mode centric. Primary: Black/Dark Gray. Accents: White (glow), Yellow (#FFD500 for status), Amber (risk).
