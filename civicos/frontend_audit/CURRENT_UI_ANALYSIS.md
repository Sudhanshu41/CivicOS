# CivicOS — Current UI Analysis

## Dashboard Overview
The CivicOS dashboard is a high-fidelity, cinematic AI Operating System. It uses a "Glassmorphic Command Center" aesthetic characterized by deep blacks, subtle glows, and technical overlays.

## Layout System
- **Split Shell**: A collapsible left sidebar for navigation and a main content area.
- **Responsive Grid**: Uses Tailwind's grid system (1 column on mobile, 2+ on desktop).
- **GlassPanels**: Consistent container component providing backdrop blur and thin borders.

## Existing UI Elements
- **Orchestration Graph**: Powered by `@xyflow/react` (React Flow). Visualizes agent nodes and relationships.
- **Activity Feed**: Scrolling technical logs with Framer Motion entry animations.
- **Metric Counters**: Fluctuating numerical displays for confidence and performance.
- **Status Indicators**: Pulse animations showing system "liveness".
- **Tool Grid**: Icons representing external API/Tool integrations.

## Visual Design Language
- **Aesthetic**: Futuristic, Minimalist, Cyber-Technical.
- **Premium Elements**:
  - `ScanlineOverlay`: Subtle CRTs scanline effect.
  - `CinematicBackground`: Animated mesh/neural backgrounds.
  - `HoloGrid`: Floating holographic reference grids.
  - `CursorGlow`: Interactive light tracking.

## Orchestration Visualization (Current vs. Needed)
- **Current**: Steps are purely sequential and timer-based. 
- **Missing**: 
  - **Realtime Logic**: Nodes do not react to actual backend execution events.
  - **Telemetry Detail**: No live streaming of "Thought" processes from agents.
  - **Failure States**: No visual representation of retry logic or fallback pathing.
  - **Execution History**: No way to view past workflow runs.

## Realtime WebSocket Opportunities
- **Active Node Glow**: Dynamically highlight nodes as the backend executes them.
- **Live Logs**: Stream backend telemetry directly into the `ActivityFeed`.
- **Reasoning Stream**: A text-streaming component for "AI Reasoning" (Gemini output).
- **Status Badges**: Realtime "Department Assignment" and "Severity" updates.

## Responsiveness & Theming
- **Responsiveness**: Basic responsive breakpoints are implemented. Complex graphs (React Flow) may need specific mobile optimizations.
- **Theming**: Locked to a premium dark mode. No light mode is currently supported or planned.
