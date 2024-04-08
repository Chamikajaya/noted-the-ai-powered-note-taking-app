import {SignIn} from "@clerk/nextjs";
import {Metadata} from "next";

export const metadata : Metadata = {
    title: "Noted - Sign In",
}

export default function SignInPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <SignIn appearance={{variables:{colorPrimary:"#F97315"}}}/>
        </div>)
}