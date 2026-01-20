# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a CopilotKit + A2A + A2UI starter template for building AI agents with declarative UI components. The project combines a Next.js frontend with a Python-based ADK (Agent Development Kit) backend that communicates via the A2A (Agent-to-Agent) protocol. The agent returns A2UI declarative UI components that are rendered on the frontend.

**Key Architecture**: Frontend (Next.js + CopilotKit) <-> A2A Protocol <-> Backend (Python ADK Agent + A2UI)

## Development Commands

### Installation
```bash
# Install all dependencies (installs both Node.js and Python dependencies)
npm install
# or: pnpm install / yarn install / bun install

# If Python setup fails, manually install agent dependencies
npm run install:agent
```

### Development
```bash
# Start both UI and agent servers concurrently
npm run dev

# Start with debug logging enabled
npm run dev:debug

# Start only the Next.js UI server (port 3000, uses Turbopack)
npm run dev:ui

# Start only the Python agent server (port 10002)
npm run dev:agent
```

### Build & Production
```bash
# Build Next.js application
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Project Structure

### Frontend (Next.js)
- **`app/page.tsx`**: Main UI entry point with CopilotChat component
- **`app/layout.tsx`**: Root layout with font configuration and A2UI-specific Google Fonts
- **`app/theme.ts`**: A2UI theme configuration
- **`app/a2ui-theme.css`**: A2UI styling
- **`app/api/copilotkit/[[...slug]]/route.tsx`**: CopilotKit API route that connects to the A2A agent (port 10002)

### Backend (Python Agent)
- **`agent/`**: Python agent implementation directory (UV workspace member)
  - **`agent.py`**: Core `RestaurantAgent` class with LLM integration and UI validation logic
  - **`agent_executor.py`**: `RestaurantAgentExecutor` handles A2A protocol execution, parses client events, and manages task states
  - **`__main__.py`**: A2A server entry point (Starlette/Uvicorn, default port 10002)
  - **`tools.py`**: Agent tools (e.g., `get_restaurants`)
  - **`prompt_builder.py`**: Contains A2UI component definitions and examples that the agent uses to generate UI
  - **`restaurant_data.json`**: Sample restaurant data
  - **`.env`**: Environment variables (GEMINI_API_KEY required)

### A2UI Extension
- **`a2ui_extension/`**: Python implementation of the A2UI extension (UV workspace member)

### Configuration
- **`pyproject.toml`**: Root UV workspace configuration (members: `a2ui_extension`, `agent`)
- **`scripts/`**: Shell and batch scripts for running/setting up the agent
- **`package.json`**: Node.js dependencies and scripts

## Architecture Details

### A2A Protocol Flow
1. User interacts with CopilotChat UI in `app/page.tsx`
2. Request goes through `/api/copilotkit` API route
3. API route uses `@a2a-js/sdk` client to communicate with Python agent on port 10002
4. Python agent (`agent_executor.py`) processes the request:
   - Parses text input or A2UI client events (e.g., `book_restaurant`, `submit_booking`)
   - Calls LLM agent in `agent.py` with appropriate prompt
   - Agent generates A2UI JSON components using examples from `prompt_builder.py`
   - Response is validated against A2UI schema with retry logic
5. Agent executor splits response into text and DataParts (A2UI components)
6. CopilotKit renders A2UI components using `@copilotkit/a2ui-renderer`

### A2UI Component Generation
- The agent in `agent.py` includes instructions to generate A2UI JSON
- `prompt_builder.py` contains:
  - `A2UI_SCHEMA`: JSON schema for A2UI messages
  - `RESTAURANT_UI_EXAMPLES`: Example A2UI component templates (restaurant cards, booking forms, confirmations)
  - Prompt builder functions that inject these into the LLM context
- Agent response format: `"<text>---a2ui_JSON---<json_array>"`
- The delimiter `---a2ui_JSON---` splits text from UI components
- JSON validation happens in `agent.py` with retry logic (max 2 attempts)

### Environment Variables
- **`agent/.env`**: Must contain `GEMINI_API_KEY` (or set `GOOGLE_GENAI_USE_VERTEXAI=TRUE`)
- Default LLM: `gemini/gemini-2.5-flash` (configurable via `LITELLM_MODEL`)

### Agent Execution States
- `TaskState.working`: Agent is processing (intermediate updates)
- `TaskState.input_required`: Waiting for user action (e.g., after showing restaurant list)
- `TaskState.completed`: Task finished (e.g., after booking confirmation)

## Modifying A2UI Components

To edit or add new A2UI components that the agent can generate:
1. Edit component definitions in `agent/prompt_builder.py`
2. Use the [A2UI Composer](https://a2ui-editor.ag-ui.com) to generate new components
3. Add examples to `RESTAURANT_UI_EXAMPLES` in the appropriate format
4. Update `A2UI_SCHEMA` if adding new component types

## Python Environment

This project uses **UV** for Python dependency management (workspace-based):
- Root workspace defined in `pyproject.toml`
- Agent requires Python 3.13+
- Dependencies: `a2a-sdk`, `google-adk`, `litellm`, `a2ui`, `python-dotenv`, `jsonschema`

To manually sync Python environment:
```bash
cd agent
uv sync
uv run .
```

## Troubleshooting

### Agent Connection Issues
If you see "I'm having trouble connecting to my tools":
1. Verify the ADK agent is running on port 10002
2. Check `agent/.env` has valid `GEMINI_API_KEY`
3. Ensure both servers started successfully (check console output)
4. Verify API route connects to `http://127.0.0.1:10002` in `app/api/copilotkit/[[...slug]]/route.tsx`

### Python Import Errors
```bash
cd agent
uv sync
```

### UI Validation Errors
- Check browser console and agent server logs for A2UI validation failures
- Agent automatically retries once if JSON is malformed or doesn't match schema
- Review `agent.py` validation logic and `prompt_builder.py` schema

## Important Notes

- Lock files are gitignored to support multiple package managers - regenerate your own lock file
- The agent serves static images from `agent/images/` via `/static` route
- CORS is configured for `http://localhost:5173` in `__main__.py`
- The project uses Next.js with Turbopack for faster dev builds
- A2UI requires specific Google Fonts loaded in `app/layout.tsx`
