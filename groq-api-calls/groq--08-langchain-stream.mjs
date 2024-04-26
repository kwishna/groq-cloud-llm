import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('./.env') });

const model = new ChatGroq({
    temperature: 0.8,
    model: 'llama3-8b-8192',
    apiKey: process.env.GROQ_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful AI assistant."],
    ["human", "{input}"],
]);

const outputParser = new StringOutputParser();
const chain = prompt.pipe(model).pipe(outputParser);

const response = await chain.stream({
    input: "How many total days will be in year 3000?",
});

let res = "";
for await (const item of response) {
    res += item;
    // console.log("stream:", res);
    console.log(res);
    console.log('------------------------------------------------------------------------------------------------------------------------');
}