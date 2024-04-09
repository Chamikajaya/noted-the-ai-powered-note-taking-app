import OpenAI from "openai";

// const apiKey = process.env.OPENAI_API_KEY;

const apiKey = "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";

if (!apiKey)
  throw new Error("No OpenAI API key found in environment variables");

const openAI = new OpenAI({ apiKey });

export default openAI; // export the openAI instance to be used in other files

// refer -->  https://platform.openai.com/docs/guides/embeddings/what-are-embeddings?lang=node
export async function getEmbedding(text: string) {
  const response = await openAI.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  if (!response) throw new Error("No response from OpenAI API");

  console.log(response.data[0].embedding);
  return response.data[0].embedding; // returns an array of embeddings
}
