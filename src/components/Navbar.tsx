import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png"
import {UserButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";


export default function Navbar() {
    return (
        <div className="px-6 py-4 shadow ">
            <div className=" max-w-6xl flex flex-wrap gap-3 items-center justify-between">
                <Link href="/notes" className="flex  items-center ">
                    <Image src={logo} alt="Site Logo" width={100} height={12}/>
                    <span className="text-2xl font-bold tracking-tight">Noted</span>
                </Link>
                <div className="flex items-center gap-3">
                    <UserButton afterSignOutUrl="/" appearance={{
                        elements: {avatarBox: {width: "3rem", height: "3rem"}},
                    }}/>
                    <Button>
                        <Plus className="mr-2" size={22}/>
                        <span className="font-semibold"> Create a note</span>
                    </Button>
                </div>
            </div>
        </div>
    )

}