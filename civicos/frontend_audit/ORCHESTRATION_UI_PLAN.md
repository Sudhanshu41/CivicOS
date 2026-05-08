# CivicOS — Orchestration UI Implementation Plan

## Phase 1: Realtime Connectivity (Foundation)
- **Task**: Implement `SocketProvider` and `useOrchestration` hook.
- **Goal**: Replace the `useWorkflow` timer with real backend events.
- **Visuals**: Map backend event `node_id` to React Flow `node.id`.

## Phase 2: Live Execution Timeline
- **Component**: `ActivityFeed.tsx`
- **Upgrade**: Allow real-time appending of messages from the WebSocket.
- **Animation**: Use Framer Motion's `layout` prop to slide old logs down smoothly as new ones arrive.
- **Telemetry**: Add "Token usage" and "Latency" micro-metatdata to each log entry.

## Phase 3: AI Reasoning Panel
- **Component**: `src/components/dashboard/orchestration/ReasoningEngine.tsx`
- **Feature**: A streaming text component that displays the current agent's "chain of thought".
- **Effect**: Typewriter effect or subtle fade-in as tokens are received.

## Phase 4: Graph State Visualization
- **States**: 
  - `QUEUED`: Dimmed node with static edges.
  - `ACTIVE`: Glowing node, animated edges, `PulseIndicator` in 'processing'.
  - `COMPLETED`: Bright white node, solid white edge, CheckCircle icon.
  - `FAILED`: Red border, red pulse, AlertCircle icon.

## Phase 5: Workflow Replay & History
- **New Page**: `/dashboard/issues/[id]`
- **Feature**: Load the `final_state` from the DB and "replay" the orchestration at 2x speed for reviewers.
- **Telemetry**: Display a post-mortem chart of agent latencies.

## Reusable Components
- `GlassPanel`: Main container for all new panels.
- `PulseIndicator`: For live status across all nodes.
- `MetricCounter`: For live confidence scores.
- `StatusBadge`: For departmental assignments.

## New Component Needs
- `StreamingText`: For real-time AI thought visualization.
- `TraceDetailView`: A side-panel to view full JSON input/output of a specific node on click.
- `GlobalSystemClock`: Syncing the frontend display with backend `started_at` times.
