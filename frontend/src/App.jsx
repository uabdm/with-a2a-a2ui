import React from 'react';
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { Container, Typography, Box } from '@mui/material';
import "@copilotkit/react-ui/styles.css";

function App() {
  return (
    <CopilotKit
      runtimeUrl="http://localhost:4000/api/copilotkit"
      showDevConsole={true}
    >
      <Container maxWidth="md">
        <Typography variant="h3" align="center" sx={{ mt: 4, mb: 2 }}>
          University Assistant
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Powered by A2UI & CopilotKit
        </Typography>

        <Box sx={{ mt: 4 }}>
          <CopilotChat
            className="h-full"
            labels={{
              title: "University Chat",
              initial: "Hi! I can show you University Apps, News, or HR Reports. What do you need?"
            }}
            instructions={`You are a helpful assistant for a University. When the user asks to see visual information like apps, news, or reports, you should render UI using A2UI format.

Available components:
- Text: For displaying text content
- Card: For container elements
- Button: For interactive buttons
- Row, Column: For layout primitives
- List: For displaying lists of items

Use proper A2UI JSON structure in your responses. Example structure:
{
  "surfaceId": "main-surface",
  "components": [
    {
      "id": "component-1",
      "component": {
        "Text": {
          "text": {"literalString": "Hello World"},
          "usageHint": "h1"
        }
      }
    }
  ]
}`}
          />
        </Box>
      </Container>
    </CopilotKit>
  );
}

export default App;
