// api/chat

import {ChatCompletionMessage} from "openai/resources/index.mjs";
import openAI, {getEmbedding} from "@/lib/openAI";
import {auth} from "@clerk/nextjs";
import {notesIndex} from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import {OpenAIStream, StreamingTextResponse} from "ai";




export async function POST(req: Request) {

    try {

        // ! intentional error to check the something went wrong message
        // throw new Error("Ooops there was an ERROR")

        const body = await req.json();
        const messages: ChatCompletionMessage[] = body.messages;  // messages sent by Vercel sdk

        const truncatedMessages = messages.slice(-10);  // get the last 10 messages by the user and the AI model

        // iterate the messages array and get a final big string of text to be sent to generate embeddings  ==>
        const stringOfTextFromConversation = truncatedMessages.map((message) => message.content).join("\n")

        // get the embeddings for the messages truncated ->
        const embeddings = await getEmbedding(stringOfTextFromConversation);

        const {userId} = auth()

        // get embeddings from Pinecone, which are similar to the embeddings corresponding to the conversation we had, in fact this will return an obj similar to the following , refer ==> https://docs.pinecone.io/reference/api/data-plane/query
        const similarEmbeddingsFromPineconeDb = await notesIndex.query({
            vector: embeddings,  // pass the embeddings we got from the conversation
            topK: 10,  // how many similar results to send, higher the better, however since we will be sending more data to LLM model, hence cost is also high
            filter: {userId}
        })

        // now get the corresponding notes for those embeddings returned by Pinecone
        const relatedNotes = await prisma.notes.findMany({
            where: {
                id: {in: similarEmbeddingsFromPineconeDb.matches.map((match) => parseInt(match.id))}  // coz notes in Postgres and embeddings in Pinecone has the same id (refer note.ts -> POST handler)
            }
        })

        console.log("The related notes are as follows .. \n " + relatedNotes)

        const systemMessage: ChatCompletionMessage = {
            role: "assistant",
            content: "\"You are an advanced AI-powered note-taking assistant. You provide responses to user inquiries by leveraging their stored notes.\"\n" +
                "\"Below are the pertinent notes related to the current query:\"" + relatedNotes.map((note) => `Note title : ${note.title} \n\n Note content: ${note.content}`).join("\n")
        }

        // making request to LLM
        const llmResponse = await openAI.chat.completions.create({
            model:"gpt-3.5-turbo",
            stream:true,
            messages:[systemMessage, ...truncatedMessages]
        })

        // return the response -> https://sdk.vercel.ai/docs/api-reference/providers/openai-stream
        const stream = OpenAIStream(llmResponse);
        return new StreamingTextResponse(stream)


    } catch (e) {
        console.error(e);
        return Response.json({error: "Internal Server Error"}, {status: 500})
    }

}