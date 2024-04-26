import Groq from 'groq-sdk'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('./.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

const response1 = await groq.chat.completions.create(
    {
        messages: messages,
        model: 'mixtral-8x7b-32768',
    }
).asResponse();

console.log(JSON.stringify(await response1.json(), null, 2));

console.log("-------------------------------------------------------------------------------------------");

const response2 = await groq.chat.completions.create(
    {
        messages: messages,
        model: 'mixtral-8x7b-32768',
    }
).asResponse();

console.log(JSON.stringify(await response2.json(), null, 2));