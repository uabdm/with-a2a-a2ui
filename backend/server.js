import express from 'express';
import cors from 'cors';
import { CopilotRuntime, GoogleGenerativeAIAdapter, copilotRuntimeNodeExpressEndpoint } from '@copilotkit/runtime';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { A2UI_SCHEMA } from './uiSchema.js';

// Better environment variable loading
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
// NOTE: Do NOT use express.json() globally - CopilotKit needs the raw body stream

const port = 4000;

// Initialize CopilotKit runtime (do this ONCE at startup)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const serviceAdapter = new GoogleGenerativeAIAdapter({
    model: genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
});

const runtime = new CopilotRuntime({
    actions: [
        {
            name: "render_ui",
            description: "Call this tool to render a UI for the user using A2UI specification. Use this when the user asks to see applications, news, reports, or any visual information.",
            parameters: [
                {
                    name: "surfaceUpdate",
                    type: "object",
                    description: "The A2UI surface update payload",
                    required: true,
                    attributes: [
                        {
                            name: "surfaceId",
                            type: "string",
                            description: "Unique identifier for this UI surface",
                            required: true
                        },
                        {
                            name: "components",
                            type: "object[]",
                            description: "Array of UI components to render",
                            required: true
                        }
                    ]
                }
            ],
            handler: async ({ surfaceUpdate }, context) => {
                console.log("Rendering UI:", JSON.stringify(surfaceUpdate, null, 2));

                // Emit as activity message for A2UI renderer
                context.emitActivity({
                    type: "a2ui",
                    content: surfaceUpdate
                });

                return "UI rendered successfully";
            }
        }
    ]
});

const copilotKitHandler = copilotRuntimeNodeExpressEndpoint({
    endpoint: '/',
    runtime,
    serviceAdapter,
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Handle CopilotKit requests
app.use('/api/copilotkit', copilotKitHandler);

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
    console.log(`CopilotKit endpoint: http://localhost:${port}/api/copilotkit`);
    console.log(`Health check: http://localhost:${port}/health`);
});
