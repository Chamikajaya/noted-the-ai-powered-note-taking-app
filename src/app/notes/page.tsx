import {Metadata} from "next";
import {auth} from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import {Toaster} from "sonner";
import NoteCard from "@/components/NoteCard";


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
        },
        orderBy: {  // order the notes by createdAt in descending order , otherwise when a user updates a note it will get rendered at the end of the list. This way since we are rendering the list in descending order, the updated note will be where it initially was
            createdAt: "desc"
        }
    });


    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allNotesOfThisUser.map(note => (
                    <NoteCard key={note.id} note={note}/>
                ))}
                {allNotesOfThisUser.length === 0 &&
                    <p className="text-center col-span-full font-semibold text-xl">It is empty here. Create your first
                        note by adding thr button above😊</p>}
            </div>
            <Toaster richColors/>
        </>

    );
}