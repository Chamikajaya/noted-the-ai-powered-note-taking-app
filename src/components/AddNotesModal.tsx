import {useForm} from "react-hook-form";
import {createNoteSchema, CreateNoteSchema} from "@/lib/validation/note";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import LoadingButton from "@/components/ui/loadingButton";
import {useRouter} from "next/navigation";
import {toast, Toaster} from "sonner";



interface AddNotesModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AddNotesModal({isOpen, setIsOpen}: AddNotesModalProps) {

    const router = useRouter();


    // defining the form -> https://ui.shadcn.com/docs/components/form
    const form = useForm<CreateNoteSchema>({
        resolver: zodResolver(createNoteSchema),
        defaultValues: {
            title: "",
            content: ""
        }
    })

    async function onSubmit(inputData: CreateNoteSchema) {
        try {
            const response = await fetch("/api/notes", {
                method: "POST",
                body: JSON.stringify(inputData),
            });

            if (!response.ok) {
                throw new Error("An error occurred while creating the note, status code: " + response.status)
            }

            // If the response is successful -->
            form.reset();

            router.refresh();  // * Refresh the current route. Making a new request to the server, re-fetching data requests, and re-rendering Server Components. (otherwise the newly submitted note will not be shown in the notes page)
            setIsOpen(false);  // close the modal
            toast.success("Note created successfully");


        } catch (e) {
            console.error(e)
            toast.error("An error occurred while creating the note");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}> {/* open and onOpenChange are default prop names by shadcn */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center font-semibold">Add Note</DialogTitle>
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
                        <DialogFooter>
                            <LoadingButton type="submit" loading={form.formState.isSubmitting} >Submit</LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>

    )


}
