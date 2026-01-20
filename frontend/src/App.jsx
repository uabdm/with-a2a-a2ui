import React, { useState } from 'react';
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useRenderToolCall } from "@copilotkit/react-core";
import { Container, Typography, Box, Paper } from '@mui/material';
import { A2UIRenderer } from './components/A2UIRenderer';

// Main Content that uses the hook
const AgentUI = () => {
  useRenderToolCall({
    name: "render_ui",
    render: ({ args, status }) => {
      // 'args' will contain the surfaceUpdate object
      return (
        <Paper elevation={3} sx={{ p: 2, m: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="caption" color="textSecondary">
            {status === "inProgress" && "Loading UI..."}
            {status === "executing" && "Rendering UI..."}
            {status === "complete" && "UI Ready"}
          </Typography>
          <A2UIRenderer uiJson={args} />
        </Paper>
      );
    }
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography color="textSecondary">Ask the agent to show you something (e.g., "show me the list of apps")...</Typography>
    </Box>
  );
};

function App() {
  return (
    <CopilotKit runtimeUrl="http://localhost:4000/api/copilotkit">
      <Container maxWidth="md">
        <Typography variant="h3" align="center" sx={{ mt: 4, mb: 2 }}>
          University Assistant
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Powered by A2UI & CopilotKit
        </Typography>

        <AgentUI />

        <CopilotPopup
          instructions={`You are a helpful assistant for a University. When the user asks to see visual information like apps, news, or reports, you MUST use the 'render_ui' tool.

When calling render_ui, provide a surfaceUpdate object with this structure:
{
  "surfaceUpdate": {
    "surfaceId": "main-surface",
    "components": [
      {
        "id": "root",
        "component": {
          "AppList": {
            "apps": ["App 1", "App 2", "App 3"]
          }
        }
      }
    ]
  }
}

Available component types:
- AppList: Shows university applications. Props: apps (array of app names)
- NewsFeed: Shows news feed. Props: category (string like "science", "sports")
- Text: Shows text. Props: text (object with literalString), usageHint (h1, h2, body, etc)
- Card: Container. Props: child (component id reference)
- Row/Column: Layout containers. Props: children.explicitList (array of component ids)

Example for showing apps:
Call render_ui with surfaceUpdate containing an AppList component with apps like ["Asana", "Zoom", "Slack", "Google Drive"].`}
          labels={{
            title: "University Chat",
            initial: "Hi! I can show you University Apps, News, or HR Reports. What do you need?"
          }}
        />
      </Container>
    </CopilotKit>
  );
}

export default App;
