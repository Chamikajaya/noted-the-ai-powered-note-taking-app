import {useChat} from 'ai/react';
import {cn} from "@/lib/utils";
import {XCircle} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";  // cn is used to merge the classes in tailwindcss

/*
use chat hook --> After submitting a message, the useChat hook will automatically append a user message to the chat history and trigger an API call to the configured endpoint (default is api/chat). The response will be streamed to the chat history and returned by the hook as messages. Whenever a new chunk of streamed messages is received, the hook will automatically update the messages state and trigger a re-render.
 */

interface ChatbotModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChatbotModal({isOpen, onClose}: ChatbotModalProps) {

    // refer -> https://sdk.vercel.ai/docs/api-reference/use-chat
    const {messages, input, handleInputChange, handleSubmit, setMessages, isLoading, error} = useChat();  //

    return (
        // wrapper div containing the close button and the chatbot messages div
        <div className={cn("bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36", isOpen ? "fixed" : "hidden")}>
            <button onClick={onClose} className="mb-1 ms-auto block">
                <XCircle size={24} className="text-red-500"/>
            </button>
            {/*div containing chat messages */}
            <div className="flex h-[600px] flex-col rounded bg-background border shadow-2xl">
            {/*    chat message div*/}
                <div className="h-full">Your Message</div>
                <form onSubmit={handleSubmit} className="m-3 flex gap-2">
                    <Input value={input} onChange={handleInputChange} placeholder="Your message..."  />
                    <Button type="submit" >Submit</Button>
                </form>
            </div>
        </div>
    )
}