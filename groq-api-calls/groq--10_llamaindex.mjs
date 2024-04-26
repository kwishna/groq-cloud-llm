import fs from "fs";
import dotenv from 'dotenv'
import path from 'path'
import { Document, Groq, Settings, VectorStoreIndex } from "llamaindex";

dotenv.config({ path: path.resolve('./.env') });


// Update llm to use Groq
Settings.llm = new Groq({
  temperature: 0.8,
  model: 'llama3-8b-8192',
  apiKey: process.env.GROQ_API_KEY,
});

async function main() {

  // Load essay from abramov.txt in Node
  const _path = path.resolve("./groq-api-calls/movies.txt");
  const essay = fs.readFileSync(_path, "utf-8");
  const document = new Document({ text: essay, id_: "essay" });

  // Load and index documents
  const index = await VectorStoreIndex.fromDocuments([document]);

  // get retriever
  const retriever = index.asRetriever();

  // Create a query engine
  const queryEngine = index.asQueryEngine({
    retriever,
  });

  const query = "Suggest a comedy move.";

  // Query
  const response = await queryEngine.query({
    query,
  });

  // Log the response
  console.log(response.response);
}

await main();