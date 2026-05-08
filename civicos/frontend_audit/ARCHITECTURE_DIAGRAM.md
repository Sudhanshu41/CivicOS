# CivicOS — Frontend Architecture Diagram

```mermaid
graph TD
    subgraph Browser["Client Browser (Next.js App)"]
        subgraph AppRouter["Next.js App Router"]
            PageOrchestration["/dashboard/orchestration"]
            PageDashboard["/dashboard"]
            LayoutDashboard["Dashboard Layout"]
        end

        subgraph Components["UI Components"]
            ReactFlow["React Flow Graph"]
            ActivityFeed["Activity Feed (Logs)"]
            GlassPanel["Glass Panel Containers"]
            FramerMotion["Framer Motion Animations"]
        end

        subgraph Services["Infrastructure (Upcoming)"]
            SocketProvider["WebSocket Provider"]
            APIClient["API Client (Fetch/Axios)"]
            useOrchestration["useOrchestration Hook"]
        end
    end

    subgraph Backend["Python Backend (FastAPI)"]
        RESTAPI["REST API Endpoints"]
        WSManager["WebSocket Connection Manager"]
        Orchestrator["AI Workflow Orchestrator"]
    end

    %% Interactions
    PageOrchestration --> useOrchestration
    useOrchestration --> SocketProvider
    useOrchestration --> APIClient
    
    APIClient -- "POST /analyze" --> RESTAPI
    RESTAPI -- "Trigger" --> Orchestrator
    Orchestrator -- "Broadcast Events" --> WSManager
    WSManager -- "Streaming JSON" --> SocketProvider
    
    SocketProvider -- "Live Update" --> useOrchestration
    useOrchestration -- "Update Nodes" --> ReactFlow
    useOrchestration -- "Append Log" --> ActivityFeed
    
    LayoutDashboard --> PageOrchestration
    LayoutDashboard --> PageDashboard
```

## Key Flows
1. **Trigger**: User clicks "Analyze" -> API Client sends request to Backend -> Backend returns 202.
2. **Listen**: `useOrchestration` hook establishes WebSocket connection via `SocketProvider`.
3. **Visualize**: Backend streams "node started" events -> Hook updates React Flow node status -> Framer Motion triggers glow/pulse animations.
4. **Log**: Backend streams "log" events -> Hook appends to `ActivityFeed` state -> UI renders new log line with slide-up animation.
