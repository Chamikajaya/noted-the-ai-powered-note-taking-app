// api/notes


import {createNoteSchema, updateNoteSchema, deleteNoteSchema} from "@/lib/validation/note";
import {auth} from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";


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

        // create a note in the database
        const note = await prisma.notes.create({
            data: {
                title,
                content,
                userId,
            },
        });

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

        // update the note in the database
        const updatedNote = await prisma.notes.update({
            where: {
                id
            },
            data: {
                title,
                content
            }
        });

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

        // delete the note from the database
        await prisma.notes.delete({
            where: {
                id
            }
        });

        return Response.json({message: "Note deleted successfully"}, {status: 200})  // return the success message to the client

    } catch (e) {
        console.error(e);  // log the error to the console
        return Response.json({error: "Internal Server Error"}, {status: 500})  // return the error to the client
    }
}