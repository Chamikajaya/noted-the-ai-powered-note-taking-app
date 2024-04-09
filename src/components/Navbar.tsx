"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png"
import {UserButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import AddNotesModal from "@/components/AddNotesModal";
import {useState} from "react";



export default function Navbar() {

    const [showAddNoteModal, setShowAddNoteModal] = useState(false)

    return (
        <>
            <div className="px-6 py-4 shadow ">
                <div className=" max-w-6xl flex flex-wrap gap-3 items-center justify-between mx-auto">
                    <Link href="/notes" className="flex  items-center ">
                        <Image src={logo} alt="Site Logo" width={80} height={10}/>
                        <span className="text-2xl font-bold tracking-tight">Noted</span>
                    </Link>
                    <div className="flex items-center gap-5">
                        <UserButton afterSignOutUrl="/" appearance={{
                            elements: {avatarBox: {width: "2.5rem", height: "2.5rem"}},
                        }}/>
                        <Button onClick={() => setShowAddNoteModal(true)} >
                            <Plus className="mr-2" size={16}/>
                            <span className="font-semibold"> Create a note</span>
                        </Button>
                    </div>
                </div>
            </div>
            <AddNotesModal isOpen={showAddNoteModal} setIsOpen={setShowAddNoteModal}/> {/* We could have simply used showAddNoteModal && <AddNotesModal/> but this would have cleared the typed input upon closing the modal as this would have unmounted the component. Hence this alternative approach is used  */}
        </>

    )

}