import Groq from 'groq-sdk'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('./.env') });

const groq = new Groq({
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

const stream = await groq.chat.completions.create(
    {
        messages: messages,
        model: 'mixtral-8x7b-32768',
        stream: true
    }
);

for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
}