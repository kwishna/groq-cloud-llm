import Groq from 'groq-sdk'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('./.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
* An object containing the names of various language models used in the GROQ API.
* @property {string} LAMMA3_70B - The name of the 70B parameter LLAMA3 language model.
* @property {string} LAMMA3_8B - The name of the 8B parameter LLAMA3 language model.
* @property {string} GEMMA_7B_IT - The name of the 7B parameter GEMMA language model for Italian.
* @property {string} MIXTRAL_8x7B - The name of the 8x7B parameter MIXTRAL language model.
*/
const Model = {
    LAMMA3_70B: "llama3-70b-8192",
    LAMMA3_8B: "llama3-8b-8192",
    GEMMA_7B_IT: "gemma-7b-it",
    MIXTRAL_8x7B: "mixtral-8x7b-32768"
};

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

/**
* Generates a chat completion using the LAMMA3_70B language model.
* 
* @param {Object} messages - An array of messages to use for the chat completion.
* @param {number} [temperature=0.6] - The temperature to use for the chat completion, between 0 and 1.
* @param {number} [max_tokens=1024] - The maximum number of tokens to generate for the chat completion.
* @param {number} [top_p=0.9] - The top-p value to use for the chat completion, between 0 and 1.
* @param {boolean} [stream=false] - Whether to stream the chat completion response.
* @param {string} [stop="."] - The stop sequence to use for the chat completion.
* @param {number} [seed=5] - The seed to use for the chat completion.
* @returns {Object} - The chat completion response.
*/
const chatCompletion = await groq.chat.completions.create(
    {
        "messages": messages,
        "model": Model.LAMMA3_70B,
        "temperature": 0.6,
        "max_tokens": 1024,
        "top_p": 0.9,
        "stream": false,
        // "response_format": {
        //     "type": "json_object"
        // },
        "stop": ".",
        "seed": 5
    },
    {
        maxRetries: 2, // default is 2
        stream: false,
        timeout: 10000, // default is 1 minute.
    }
);

console.log(JSON.stringify(chatCompletion, null, 2));
console.log(chatCompletion.choices[0].message.content);