import {Button, ButtonProps} from "@/components/ui/button";
import {Loader2} from "lucide-react";

/*
to create a reusable LoadingButton that can be used throughout the application. It extends the functionality of the existing Button component by adding a loading state. When loading is true, or when disabled prop is set to true the button is disabled, and a spinner icon is displayed alongside the children content.
 */

// Why do we use type, instead of interface? -->
/*
The intersection type & is used to combine the two object types. It means that LoadingButtonProps will have all the properties from ButtonProps and an additional loading property of type boolean.
 */
type LoadingButtonProps = {
    loading: boolean;
} & ButtonProps  // represents the props of the Button component.


export default function LoadingButton({children, loading, ...props}: LoadingButtonProps) {  // ...props -> destructuring the props object coming
    return (
        <Button {...props} disabled={props.disabled || loading} className="m-auto w-full font-semibold">
            {loading && <Loader2 className="mr-2 animate-spin w-4 h-4"
                                 size={16}/>} {/* Display the spinner if the form is being submitted */}
            {children}
        </Button>
    )
}