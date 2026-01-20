import express from 'express';
import cors from 'cors';
import { CopilotRuntime, GoogleGenerativeAIAdapter, copilotRuntimeNodeHttpEndpoint } from '@copilotkit/runtime';
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
app.use(express.json());

const port = 4000;

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Handle CopilotKit requests
app.use('/api/copilotkit', (req, res, next) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
        const serviceAdapter = new GoogleGenerativeAIAdapter({
            model: genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        });

        const runtime = new CopilotRuntime({
            actions: ({ properties, url }) => {
                return [
                    {
                        name: "render_ui",
                        description: "Call this tool to render a UI for the user. Use this when the user asks to see applications, news, reports, or any visual information. Provide the UI tree as a JSON object matching the A2UI schema with a surfaceUpdate containing components.",
                        parameters: [
                            {
                                name: "surfaceUpdate",
                                type: "object",
                                description: "The A2UI surface update payload containing the UI components",
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
                        handler: async ({ surfaceUpdate }) => {
                            console.log("Rendering UI:", JSON.stringify(surfaceUpdate, null, 2));
                            return { success: true, rendered: surfaceUpdate };
                        }
                    }
                ];
            }
        });

        const handler = copilotRuntimeNodeHttpEndpoint({
            endpoint: '/',
            runtime,
            serviceAdapter,
        });

        return handler(req, res, next);
    } catch (error) {
        console.error("CopilotKit error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
    console.log(`CopilotKit endpoint: http://localhost:${port}/api/copilotkit`);
    console.log(`Health check: http://localhost:${port}/health`);
});
