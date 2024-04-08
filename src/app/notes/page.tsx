import {Metadata} from "next";
import {auth} from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";


export const metadata: Metadata = {
    title: "Noted - Your Notes",
}
export default async function NotesPage() {

    const {userId} = auth();  // get the user id

    // /notes is reachable only by authenticated users
    if (!userId) throw new Error("Could not verify the user. Please try again later.")

    const allNotesOfThisUser = await prisma.notes.findMany({
        where: {
            userId
        }
    });


    return (
        <div>
            {JSON.stringify(allNotesOfThisUser)}

        </div>
    );
}