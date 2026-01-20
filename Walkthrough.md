# Walkthrough: University A2UI Demo

## What We Built

A modern **A2UI (Agent-to-UI)** architecture demo featuring:

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express + CopilotKit Runtime + **Gemini** |
| Frontend | React 18 + Material UI v5 + CopilotKit |
| A2UI | Server-defined UI JSON → Client-rendered MUI components |

## Project Structure

```
with-a2a-a2ui/
├── backend/
│   ├── server.js        # Express + CopilotKit runtime
│   ├── uiSchema.js      # A2UI component schema
│   └── .env             # GEMINI_API_KEY
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # CopilotKit provider + useCopilotAction
│   │   ├── components/
│   │   │   └── A2UIRenderer.jsx   # JSON → MUI mapper
│   │   └── university-widgets/
│   │       ├── AppList.jsx        # University apps widget
│   │       └── NewsFeed.jsx       # News feed widget
└── README.md            # Quick start guide
```

## Running the Demo

### 1. Configure API Key
Edit `backend/.env`:
```
GEMINI_API_KEY=your-actual-key
```

### 2. Start Servers
**Backend** (Terminal 1):
```bash
cd backend && npm start
# Running at http://localhost:4000
```

**Frontend** (Terminal 2):
```bash
cd frontend && npm run dev
# Running at http://localhost:5173
```

### 3. Test the Chat
Open http://localhost:5173 and try:
- *"Show me university applications"*
- *"What news is there?"*

## Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express server with CopilotKit + Gemini |
| `frontend/src/components/A2UIRenderer.jsx` | Maps A2UI JSON to MUI components |
| `frontend/src/App.jsx` | `useCopilotAction` renders agent UI |

## Current Status
- ✅ Backend running on port 4000
- ✅ Frontend running on port 5173
- ⏳ Ready for manual testing with real Gemini API key
