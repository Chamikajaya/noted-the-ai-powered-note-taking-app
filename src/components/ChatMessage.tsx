import {Message} from "ai";
import {useUser} from "@clerk/nextjs";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {Bot} from "lucide-react";

export default function ChatMessage({
                       message: { role, content },
                     }: {
  message: Pick<Message, "role" | "content">;
}) {
  const { user } = useUser();

  const isAiMessage = role === "assistant";

  return (
      <div
          className={cn(
              "mb-3 flex items-center",
              isAiMessage ? "me-5 justify-start" : "ms-5 justify-end",
          )}
      >
        {isAiMessage && <Bot className="mr-2 shrink-0" />}
        <p
            className={cn(
                "whitespace-pre-line rounded-md border px-3 py-2",
                isAiMessage ? "bg-background" : "bg-primary text-primary-foreground",
            )}
        >
          {content}
        </p>
        {!isAiMessage && user?.imageUrl && (
            <Image
                src={user.imageUrl}
                alt="User image"
                width={100}
                height={100}
                className="ml-2 h-10 w-10 rounded-full object-cover"
            />
        )}
      </div>
  );
}