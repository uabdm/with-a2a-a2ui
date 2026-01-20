# Architecture Recommendation: Node.js A2UI with Legacy React & Material UI

## Goal
Migrate the "A2UI" (Agent-to-UI) architecture from a Python/Next.js setup to a **Node.js Express** backend and a **React 18 + Material UI v5** frontend, integrating with an existing legacy codebase.

## 1. High-Level Architecture

```mermaid
graph TD
    User[User / Legacy App] <--> Frontend[React + Material UI]
    Frontend -- "User Prompt / Context" --> Backend[Node.js Express API]
    Backend -- "LLM Request (with A2UI Schema)" --> LLM[AI Model (Gemini/GPT)]
    LLM -- "Streamed JSON UI Tree" --> Backend
    Backend -- "Streamed UI Events" --> Frontend
    Frontend -- "Renders" --> ComponentMap{Component Registry}
    ComponentMap --> MUI[Material UI Components]
```

## 2. Backend Strategy (Node.js Express + CopilotKit Runtime)

We will replace the Python ADK with the **CopilotKit Node.js Runtime**.

### A. Server Setup
- **Express Server**: Hosts the CopilotKit runtime endpoints.
- **@copilotkit/runtime**: Handles the communication with the frontend, tool execution, and LLM interaction.
- **LangChainAdapter**: We will use the LangChain adapter (or OpenAI adapter) within the runtime to power the agent.
- **A2UI Schema Tool**: We will define the A2UI Schema as a "Tool" (Action) available to the AI.
    - **Name**: `render_ui`
    - **Description**: "Call this tool to render a UI for the user. Provide the UI tree as a JSON object matching the A2UI schema."
    - **Parameters**: The full A2UI JSON Schema.

### B. Streaming Response
CopilotKit handles the streaming automatically. When the LLM calls the `render_ui` tool, CopilotKit streams the function arguments (the partial JSON tree) to the client in real-time.

## 3. Frontend Strategy (React + Material UI)

### A. CopilotKit Integration
We will use `useCopilotAction` to intercept the `render_ui` tool call and render it.

```javascript
import { useCopilotAction } from "@copilotkit/react-core"; 
import { A2UIRenderer } from "./components/A2UIRenderer";

export const MainContent = () => {
  const [uiTree, setUiTree] = useState(null);

  useCopilotAction({
    name: "render_ui", // Must match backend tool name
    render: ({ args, status }) => {
      // 'args' contains the streaming JSON from the agent
      // We pass this into our custom renderer
      return <A2UIRenderer uiJson={args} status={status} />;
    }
  });

  return (
    <div>
      {/* ... other content ... */}
    </div>
  );
}
```

### B. The "Renderer" (Mapping to MUI)
Since you want Material UI, we will NOT use the default `@copilotkit/a2ui-renderer` (which assumes its own styles). Instead, we will build a custom mapper as originally planned.

```javascript
// A2UIRenderer.jsx
import { Box, Button, Typography, Card, Grid } from '@mui/material';

// Component Registry
const COMPONENT_MAP = {
  // Primitives
  Box: Box,
  Text: ({ text, variant }) => <Typography variant={variant}>{text}</Typography>,
  Button: ({ label, action }) => <Button variant="contained" onClick={() => handleAction(action)}>{label}</Button>,
  Card: Card,
  
  // Layouts (A2UI 'Row'/'Column' map to MUI Flexbox or Grid)
  Row: ({ children }) => <Box display="flex" gap={2}>{children}</Box>,
  Column: ({ children }) => <Box display="flex" flexDirection="column" gap={2}>{children}</Box>,

  // Domain Specific for University
  AppList: UniversityAppListWidget, // Custom component defined elsewhere
  NewsFeed: UniversityNewsFeedWidget
};

// ... recursive render implementation ...
```

## 4. Domain Specifics (University Demo)

For the "University" demo, we will define specialized schema types that map to complex MUI compositions.

1.  **Applications Widget**:
    *   **Schema**: `{ type: "AppList", props: { apps: ["Asana", "Zoom"] } }`
    *   **Implementation**: A generic `AppList` component that renders the icons/names.
2.  **News Feed**:
    *   **Schema**: `{ type: "NewsFeed", props: { category: "science" } }`
    *   **Implementation**: Component that might fetch data itself OR take data passed in the props.

## 5. Implementation Plan for Demo

1.  **Scaffold**:
    *   Initialize a new Monorepo (or simple folder structure) with:
        *   `backend/`: Node.js + Express + `@copilotkit/runtime`.
        *   `frontend/`: Vite + React + MUI + `@copilotkit/react-core`.
2.  **Backend Implementation**:
    *   Install `@copilotkit/runtime`, `langchain`, `express`.
    *   Setup `POST /copilotkit` endpoint.
    *   Define the `render_ui` tool with the A2UI schema (ported from `prompt_builder.py`).
3.  **Frontend Implementation**:
    *   Install `@mui/material`, `@copilotkit/react-core`, `@copilotkit/react-ui`.
    *   Create `A2UIRenderer.jsx` with the MUI mapping.
    *   Implement `useCopilotAction` to connect the backend tool to the renderer.
4.  **Verification**:
    *   Test by asking "Show me the university applications" and verifying the MUI grid renders.

## User Review Required
- **Legacy Syntax**: This plan assumes we can write *new* code (the renderer) as Functional Components. This is standard even in legacy apps (React 16.8+ supports hooks). Is this acceptable?
- **Streaming**: Do you prefer detailed streaming (component popping in one by one) or just "loading -> full UI"? Streaming is "A2UI style" but harder to implement from scratch without a library like `@copilotkit/react-core`. We can try to reuse CopilotKit's React hooks if possible, or build a simple custom streamer.

