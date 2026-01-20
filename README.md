# University A2UI Demo

A demonstration of the A2UI (Agent-to-UI) architecture using:
- **Backend**: Node.js + Express + CopilotKit Runtime
- **Frontend**: React 18 + Material UI v5 + CopilotKit

## Quick Start

### 1. Configure API Key
Edit `backend/.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-...
```

### 2. Start Backend
```bash
cd backend
npm start
```
Backend runs on http://localhost:4000

### 3. Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

## How It Works
1. User asks a question in the chat
2. Agent decides to render UI using the `render_ui` tool
3. CopilotKit streams the A2UI JSON to the frontend
4. `A2UIRenderer` maps the JSON to Material UI components
