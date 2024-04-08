import Image from "next/image";
import logo from "@/assets/logo.png"
import {Button} from "@/components/ui/button";
import {ArrowBigRight} from "lucide-react";
import Link from "next/link";
import {auth} from "@clerk/nextjs";
import {redirect} from "next/navigation";



const RootPage = () => {
    const {userId} = auth();

    // Redirect to notes page if user is already signed in
    userId && redirect("/notes");

    return (
        <main className="flex flex-col items-center gap-5 h-screen justify-center">
            <div className="flex flex-row items-center">
                <Image src={logo} alt="site logo" height={100} width={100}/>
                <span className="text-4xl lg:text-6xl font-extrabold tracking-tight mr-4">Noted</span>
            </div>
            <p className="max-w-prose text-center text-sm">
                Welcome to <span className="font-semibold">NOTED</span>, the  AI Note Taking App! Simplify your life and boost productivity with our intuitive
                platform. Capture your thoughts, ideas, and inspirations effortlessly, and let our AI-powered features
                organize and enhance your notes. </p>
            <Button asChild className="font-semibold flex items-center gap-1">
                {/*asChild prop is used to give this Link ShadCn button's styling*/}
                <Link href={"/sign-in"}>
                    <ArrowBigRight size={18}/>
                    Open
                </Link>

            </Button>

        </main>
    );
};

export default RootPage;