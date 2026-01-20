import express from 'express';
import cors from 'cors';
import { CopilotRuntime, GoogleGenerativeAIAdapter, copilotRuntimeNodeHttpEndpoint } from '@copilotkit/runtime';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
        const runtime = new CopilotRuntime();

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
