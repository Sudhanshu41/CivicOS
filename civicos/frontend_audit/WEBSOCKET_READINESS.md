# CivicOS — WebSocket Readiness Audit

## Current Status: **NOT IMPLEMENTED**

The frontend currently has ZERO websocket infrastructure. All "realtime" behavior is simulated using client-side timers.

## Missing Infrastructure
- **WebSocket Provider**: No global React Context for managing socket connections.
- **Hook Layer**: No `useSocket` or `useEventSource` hooks.
- **Event Dispatcher**: No centralized logic to handle different event types (e.g., `node_started`, `node_completed`, `workflow_finished`).
- **Reconnection Logic**: No handling for socket drops or backoff.

## Orchestration Integration Insertion Points

### 1. `src/providers/SocketProvider.tsx` (Recommended)
A new top-level provider should be wrapped around the dashboard layout to maintain a single persistent connection.

### 2. `src/hooks/useOrchestration.ts` (Recommended)
A specialized hook to replace `useWorkflow.ts`. This hook should:
- Subscribe to specific `issue_id` events.
- Update node states in React Flow.
- Append logs to the Activity Feed.

### 3. Backend-Frontend Contract
The frontend is ready to receive:
- **Event Types**: 
  - `orchestration_node_update`: { node_id, status, metadata }
  - `orchestration_log_append`: { message, level, timestamp }
  - `orchestration_complete`: { final_state }

## Architecture Boundaries
- **Logic**: WebSocket events should update a central "Workflow Store" (Zustand or Context).
- **UI**: Components should subscribe to the store rather than the socket directly.
- **Fallback**: The UI should handle "Socket Disconnected" states with a subtle indicator (PulseIndicator in 'offline' state).

## Streaming Readiness
- **High**: The `ActivityFeed` and `Reasoning Engine` panels are visually designed to handle streaming data.
- **Framer Motion**: Existing animation configs are well-suited for "popping" new items into a list or updating progress bars smoothly.
