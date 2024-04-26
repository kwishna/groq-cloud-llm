import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('./.env') });

const model = new ChatGroq({
    temperature: 0.6,
    model: 'llama3-8b-8192',
    apiKey: process.env.GROQ_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful AI assistant."],
    ["human", "{input}"],
]);

const chain = prompt.pipe(model);

const response = await chain.invoke({
    input: "Why does LLM getting so famous?",
});

console.log("response", response);