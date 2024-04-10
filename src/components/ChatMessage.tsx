import {Message} from "ai";
import {useUser} from "@clerk/nextjs";
import {cn} from "@/lib/utils";
import {Bot} from "lucide-react";
import Image from "next/image";


export default function ChatMessage({message: {role, content}}: { message: Pick<Message, "role" | "content"> }) {
    // Pick utility type is used to create a new type by picking a subset of properties from an existing type. It's particularly useful when you want to work with a smaller set of properties from a larger type

    // here Pick<> is used to tell typescript that message object must contain role and content other fields such as id is optional. This is needed because we use message type in displaying loading message till the llm response comes (refer ChatbotModal.tsx)

    const {user} = useUser();

    const isAiMessage = role === "assistant";  // check if the message is from the AI model

    return (
        <div className={cn("mb-3 flex items-center ", isAiMessage ? "justify-start me-5" : "justify-end ms-5")}>
            {isAiMessage && <Bot className="ml-2 mr-2 shrink-0"/>}
            <p className={cn("whitespace-pre-line rounded-md border px-3 py-2", isAiMessage ? "bg-background" : "bg-primary text-primary-foreground")}>
                {content}
            </p>
            {!isAiMessage && user?.imageUrl && (
                <Image
                    src={user.imageUrl}
                    alt="user image"
                    height={100}
                    width={100}
                    className="ml-2 mr-2 rounded-full w-10 h-10 object-cover"
                />)}

        </div>
    )
}

