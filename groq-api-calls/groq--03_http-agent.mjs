import Groq from 'groq-sdk'
import dotenv from 'dotenv'
import path from 'path'
import http from 'http';
import { HttpsProxyAgent } from 'https-proxy-agent';

dotenv.config({ path: path.resolve('./.env') });

const groq = new Groq({
    httpAgent: new HttpsProxyAgent(process.env.PROXY_URL),
    apiKey: process.env.GROQ_API_KEY
});

const messages = [

    {
        role: 'system',
        content: 'you are a helpful assistant.',
    },

    {
        role: 'user',
        content: 'Explain the importance of low latency LLMs',
    },
];

// Override per-request:
await groq.chat.completions.create(
    {
        messages: messages,
        model: 'mixtral-8x7b-32768',
    },
    {
        httpAgent: new http.Agent({ keepAlive: false }),
    },
);

console.log(JSON.stringify(await response2.json(), null, 2));