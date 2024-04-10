"use client";

import {useState} from "react";
import ChatbotModal from "@/components/ChatbotModal";
import {Button} from "@/components/ui/button";
import {BotIcon} from "lucide-react";

// ChatbotModalButton component which is displayed in the Navbar
export default function ChatbotModalButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <BotIcon size={24} className="mr-2"/>
                <span className="font-semibold">Chatbot</span>
            </Button>
            <ChatbotModal isOpen={isOpen} onClose={() => setIsOpen(false)}/>
        </>
    )
}