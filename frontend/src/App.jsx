import React, { useState } from 'react';
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useCopilotAction } from "@copilotkit/react-core";
import { Container, Typography, Box, Paper } from '@mui/material';
import { A2UIRenderer } from './components/A2UIRenderer';

// Main Content that uses the hook
const AgentUI = () => {
  const [uiContent, setUiContent] = useState(null);

  useCopilotAction({
    name: "render_ui",
    available: "remote", // Available to the backend
    description: "Render a UI for the user",
    parameters: [
      // We can define the schema here or on backend. 
      // If we define it on the backend, we don't strictly need it here if we use 'remote'.
      // But actually, for 'useCopilotAction', usually we define the action execution logic here.
      // The backend agent CALLS this tool.
      { name: "surfaceUpdate", type: "object", description: "The A2UI surface update payload" },
      { name: "beginRendering", type: "object" } // etc
    ],
    render: ({ args, status }) => {
      // 'args' will contain the JSON stream
      return (
        <Paper elevation={3} sx={{ p: 2, m: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="caption" color="textSecondary">Agent UI ({status})</Typography>
          <A2UIRenderer uiJson={args} />
        </Paper>
      );
    },
    handler: async ({ surfaceUpdate }) => {
      // This handler is called when the tool call is *complete*.
      // We can use this to persist state if we want.
      // For now, the 'render' prop handles the streaming UI.
      console.log("UI Rendered", surfaceUpdate);
    }
  });

  return (
    <Box sx={{ mt: 4 }}>
      {!uiContent && <Typography color="textSecondary">Ask the agent to show you something...</Typography>}
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
          instructions="You are a helpful assistant for a University. You can show applications, news, and reports using the 'render_ui' tool. When asked for these things, ALWAYS call 'render_ui' with the appropriate Schema."
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
