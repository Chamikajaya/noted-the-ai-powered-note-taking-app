"use client";

import {useForm} from "react-hook-form";
import {createNoteSchema, CreateNoteSchema} from "@/lib/validation/note";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import LoadingButton from "@/components/ui/loadingButton";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Notes} from "@prisma/client";
import {useState} from "react";


interface AddOrEditNotesModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    noteToEdit?: Notes;  // optional prop

}

export default function AddOrEditNotes({isOpen, setIsOpen, noteToEdit}: AddOrEditNotesModalProps) {

    const router = useRouter();

    const [isDeleting, setIsDeleting] = useState(false);


    // defining the form -> https://ui.shadcn.com/docs/components/form
    const form = useForm<CreateNoteSchema>({
        resolver: zodResolver(createNoteSchema),
        defaultValues: {
            title: noteToEdit?.title || "",  // if noteToEdit is present then use its title otherwise use an empty string
            content: noteToEdit?.content || ""  // if noteToEdit is present then use its content otherwise use an empty string
        }
    })

    async function onSubmit(inputData: CreateNoteSchema) {
        try {

            if (noteToEdit) {  // when updating an existing note

                const response = await fetch(`/api/notes`, {
                    method: "PUT",
                    body: JSON.stringify({id: noteToEdit.id, ...inputData}),  // send the id of the note to be updated along with the new data
                });

                if (!response.ok) {
                    throw new Error("An error occurred while updating the note, status code: " + response.status)
                }

                // here no need to use form.reset() unlike in creating a new note

                toast.success("Note updated successfully");

            } else {  // when creating a new note

                const response = await fetch("/api/notes", {
                    method: "POST",
                    body: JSON.stringify(inputData),
                });

                if (!response.ok) {
                    throw new Error("An error occurred while creating the note, status code: " + response.status)
                }

                // If the response is successful -->
                form.reset();
            }


            router.refresh();  // * Refresh the current route. Making a new request to the server, re-fetching data requests, and re-rendering Server Components. (otherwise the newly submitted note will not be shown in the notes page)

            setIsOpen(false);  // close the modal


        } catch (e) {
            console.error(e)
            toast.error("An error occurred while creating the note. Please try again later.");
        }
    }

    async function deleteNote() {

        try {
            if (!noteToEdit) return;  // if there is no note, simply return
            setIsDeleting(true);

            const response = await fetch("/api/notes", {
                method: "DELETE",
                body: JSON.stringify({id: noteToEdit.id}),  // send the id of the note to be deleted
            })

            if (!response.ok) {
                throw new Error("An error occurred while deleting the note, status code: " + response.status)
            }
            toast.success("Note deleted successfully.")
            router.refresh()
            setIsOpen(false)


        } catch (e) {
            console.error(e)
            toast.error("An error occurred while deleting the note. Please try again later.");
        } finally {
            setIsDeleting(false);
        }


    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}> {/* open and onOpenChange are default prop names by shadcn */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle
                        className="text-center font-semibold">{noteToEdit ? "Update Note" : "Add Note"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField control={form.control} name="title" render={({field}) => (<FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title"{...field}/>
                            </FormControl>
                            <FormMessage/> {/* This will show the error message  */}
                        </FormItem>)}/>

                        <FormField control={form.control} name="content" render={({field}) => (<FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Content"{...field}/>
                            </FormControl>
                            <FormMessage/> {/* This will show the error message  */}
                        </FormItem>)}/>
                        <DialogFooter className="gap-2">
                            <LoadingButton
                                type="submit"
                                loading={form.formState.isSubmitting}
                                disabled={isDeleting}>Submit</LoadingButton>
                            {noteToEdit && (
                                <LoadingButton
                                    loading={isDeleting}
                                    variant="destructive"
                                    disabled={form.formState.isSubmitting}
                                    onClick={deleteNote}
                                    type="button"
                                >Delete</LoadingButton>

                            )}
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>

    )


}
