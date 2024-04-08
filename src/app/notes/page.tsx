import {Metadata} from "next";

export const metadata : Metadata = {
    title: "Noted - Your Notes",
}
export default function NotesPage() {
    return (
        <div>
            <h1>Notes</h1>
            <p>Notes page</p>
        </div>
    );
}