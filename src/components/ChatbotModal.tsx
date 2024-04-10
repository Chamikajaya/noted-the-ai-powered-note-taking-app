import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { Bot, Trash2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatMessage from "@/components/ChatMessage";
import { useEffect, useRef } from "react"; // cn is used to merge the classes in tailwindcss

/*
 * use chat hook --> After submitting a message, the useChat hook will automatically append a user message to the chat history and trigger an API call to the configured endpoint (default is api/chat). The response will be streamed to the chat history and returned by the hook as messages. Whenever a new chunk of streamed messages is received, the hook will automatically update the messages state and trigger a re-render.
 */

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  // refer -> https://sdk.vercel.ai/docs/api-reference/use-chat
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // this effect will be executed whenever the messages array changes
  // causes the container to scroll down to the bottom, ensuring that the latest message is always visible.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // to put the focus on the input field whenever the chatbot is opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const isLastMessageByUser = messages[messages.length - 1]?.role === "user";

  return (
    // wrapper div containing the close button and the chatbot messages div
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[600px] p-1 xl:right-36",
        isOpen ? "fixed" : "hidden"
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={24} className="text-red-500" />
      </button>
      {/*div containing chat messages */}
      <div className="flex h-[600px] flex-col rounded bg-background border shadow-2xl">
        {/*    div containing all chat messages */}
        <div className="h-full mt-3 px-3 overflow-y-auto" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}

          {/*display a loading message till the response from llm comes*/}
          {isLoading && isLastMessageByUser && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}

          {/* Check for errors*/}
          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "There was some issue, please try again later. ",
              }}
            />
          )}

          {/*  When the chat is empty and no error  */}
          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-3">
              <Bot />
              <span>Start chatting about your notes...</span>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-2">
          <Button
            variant="outline"
            title="Clear chat"
            size="icon"
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])}
          >
            <Trash2 />
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Your message..."
            ref={inputRef}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}
