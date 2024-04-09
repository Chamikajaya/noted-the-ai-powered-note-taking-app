import {Notes} from "@prisma/client";
import {Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";

interface NoteCardProps {
    note: Notes
}

export default function NoteCard({note}: NoteCardProps) {

    const isUpdated = note.updatedAt > note.createdAt; // check if the note is updated or not

    const timeWhenCreatedOrUpdated = (isUpdated ? note.updatedAt : note.createdAt).toDateString(); // get the date when the note was created or updated

    return (
        <Card>
            <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>{isUpdated ? `${timeWhenCreatedOrUpdated} (updated)` : `${timeWhenCreatedOrUpdated}`}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-line">{note.content}</p>  {/* Whitespace pre line is used to preserve the line breaks in the content */}
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )


}