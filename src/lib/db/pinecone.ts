import {Pinecone} from "@pinecone-database/pinecone";


const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) throw new Error("No Pinecone API key found in environment variables");

const pinecone = new Pinecone({apiKey: apiKey});

export const notesIndex =  pinecone.index("noted-app")  // export the openAI instance to be used in other files
