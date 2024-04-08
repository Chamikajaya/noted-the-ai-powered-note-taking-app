// api/notes
import {createNoteSchema} from "@/lib/validation/note";
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