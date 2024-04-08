import {useForm} from "react-hook-form";
import {createNoteSchema, CreateNoteSchema} from "@/lib/validation/note";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";


interface AddNotesModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AddNotesModal({isOpen, setIsOpen}: AddNotesModalProps) {

    // defining the form -> https://ui.shadcn.com/docs/components/form
    const form = useForm<CreateNoteSchema>({
        resolver: zodResolver(createNoteSchema),
        defaultValues: {
            title: "",
            content: ""
        }
    })

    async function onSubmit(inputData: CreateNoteSchema) {
        alert(inputData)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}> {/* open and onOpenChange are default prop names by shadcn */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Note</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField control={form.control} name="title" render={({field}) => (<FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title"{...field}/>
                            </FormControl>
                            <FormMessage/>  {/* This will show the error message  */}
                        </FormItem>)}/>

                        <FormField control={form.control} name="content" render={({field}) => (<FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Content"{...field}/>
                            </FormControl>
                            <FormMessage/>  {/* This will show the error message  */}
                        </FormItem>)}/>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )


}
