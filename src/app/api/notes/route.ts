// api/notes


import {createNoteSchema, updateNoteSchema, deleteNoteSchema} from "@/lib/validation/note";
import {auth} from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import {getEmbedding} from "@/lib/openAI";
import {notesIndex} from "@/lib/db/pinecone";


export async function POST(req: Request) {
    try {
        // parsing the body as json
        const body = await req.json();

        // validating the body against the schema using zod
        const parseResult = createNoteSchema.safeParse(body);

        if (!parseResult.success) {  // if the validation is failed
            console.error(parseResult.error);  // log the error to the console
            return Response.json({error: "Invalid input is provided"}, {status: 400})  // return the error to the client
        }

        // if the validation is successful
        const {title, content} = parseResult.data;  // get the title and content from the body

        const {userId} = auth();  // get the user id

        if (!userId) {  // if the user is not authenticated
            return Response.json({error: "Unauthorized"}, {status: 401})
        }

        const noteEmbedding = await generateEmbeddingForNote(title, content);  // generate the embedding for the note

        /*
        Transaction ==>  Transaction is a way to group multiple operations into a single unit of work. If any operation fails, the whole transaction fails. We want the note to create on postgres only if the embedding is created successfully. If the embedding creation fails, we don't want to create the note. Vice versa, if the embedding creation fails, we don't want to create the note either.

         */

        const note = await prisma.$transaction(async (tx) => {

            // 1) create the note in the Postgres database
            const note = await tx.notes.create({
                data: {
                    title,
                    content,
                    userId,
                },
            });

            // 2) create the embedding in the Pinecone database
            await notesIndex.upsert([
                {
                    id: note.id.toString(),  // convert the id to string coz pinecone only accepts string as id
                    values: noteEmbedding,
                    metadata: {userId}  // so that we can filter the embeddings by the userID to get the notes of the user
                }
            ]);

            return note;
        })


        return Response.json({note}, {status: 201})  // return the note to the client, 201 is for created


    } catch (e) {
        console.error(e);  // log the error to the console
        return Response.json({error: "Internal Server Error"}, {status: 500})  // return the error to the client
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const parseResult = updateNoteSchema.safeParse(body);

        if (!parseResult.success) {  // if the validation is failed
            console.error(parseResult.error);  // log the error to the console
            return Response.json({error: "Invalid input is provided"}, {status: 400})  // return the error to the client
        }

        // if the validation is successful
        const {id, title, content} = parseResult.data;

        // check if the note exists in the database
        const note = await prisma.notes.findUnique({
            where: {
                id
            }
        });

        if (!note) {  // if the note is not found
            return Response.json({error: "Note not found"}, {status: 404})
        }

        const {userId} = auth();

        if (!userId || userId !== note.userId) {  // * if the user is not authenticated or the user is not the owner of the note to be updated
            return Response.json({error: "Unauthorized"}, {status: 401})
        }

        const noteEmbedding = await generateEmbeddingForNote(title, content);  // generate the embedding for the note

        const updatedNote = await prisma.$transaction(async (tx) => {

            // 1) update the note in the Postgres database
            const updatedNote = await tx.notes.update({
                where: {
                    id
                },
                data: {
                    title,
                    content
                }
            });

            // 2) update the embedding in the Pinecone database
            await notesIndex.upsert([
                {
                    id: updatedNote.id.toString(),
                    values: noteEmbedding,
                    metadata: {userId}  // so that we can filter the embeddings by the userID to get the notes of the user
                }
            ]);

            return updatedNote;
        })

        return Response.json({note: updatedNote}, {status: 200})  // return the updated note to the client

    } catch (e) {
        console.error(e);  // log the error to the console
        return Response.json({error: "Internal Server Error"}, {status: 500})  // return the error to the client
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const parseResult = deleteNoteSchema.safeParse(body);

        if (!parseResult.success) {  // if the validation is failed
            console.error(parseResult.error);  // log the error to the console
            return Response.json({error: "Invalid input is provided"}, {status: 400})  // return the error to the client
        }

        // if the validation is successful
        const {id} = parseResult.data;

        // check if the note exists in the database
        const note = await prisma.notes.findUnique({
            where: {
                id
            }
        });

        if (!note) {  // if the note is not found
            return Response.json({error: "Note not found"}, {status: 404})
        }

        const {userId} = auth();

        if (!userId || userId !== note.userId) {  // * if the user is not authenticated or the user is not the owner of the note to be updated
            return Response.json({error: "Unauthorized"}, {status: 401})
        }

        await prisma.$transaction(async (tx) => {

            // delete the note from the postgres database
            await tx.notes.delete({
                where: {
                    id
                }
            });
        // delete the note from the pinecone database
            await notesIndex.deleteOne(id.toString());

        });

        return Response.json({message: "Note deleted successfully"}, {status: 200})  // return the success message to the client

    } catch (e) {
        console.error(e);  // log the error to the console
        return Response.json({error: "Internal Server Error"}, {status: 500})  // return the error to the client
    }
}


export async function generateEmbeddingForNote(title: string, content: string | undefined) {

    return getEmbedding(title + "\n\n" + content ?? " ");  // if content is not provided, use an empty string (?? is nullish coalescing operator)
}