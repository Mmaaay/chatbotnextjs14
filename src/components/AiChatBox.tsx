"use client";
import { useState, useRef, useEffect } from "react";
import { Message } from "@ai-sdk/react"; // Adjust import as necessary
import { cn } from "@/lib/utils";
import { XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";

interface aiChatBoxProps {
  open: boolean;
  onClose: () => void;
}

const AiChatBox = ({ open, onClose }: aiChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const cRef = useRef(null);
  const { userId } = useAuth();
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        cRef.current &&
        !(cRef.current as HTMLElement).contains(event.target)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: userId ?? "",
      role: "user",
      content: input,
    };
    setMessages([...messages, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let aiMessage: Message = {
          id: userId ?? "",
          role: "assistant",
          content: "",
        };

        // Push the initial AI message to state
        setMessages((prevMessages) => [...prevMessages, aiMessage]);

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunk = decoder.decode(value, { stream: true });
          aiMessage.content += chunk;

          // Update the state with the new content
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = { ...aiMessage };
            return updatedMessages;
          });
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={cRef}
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <button title="d" onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={30} />
      </button>

      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <div className="h-full overflow-auto p-3">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask Me"
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AiChatBox;

function ChatMessage({ message: { role, content } }: { message: Message }) {
  return (
    <div className="mb-4 flex flex-col">
      {role === "user" ? (
        <div className="max-w-lg self-end">
          <div className="rounded-t-lg rounded-br-lg bg-blue-100 p-2 shadow">
            <div>{content}</div>
          </div>
        </div>
      ) : (
        <div className="max-w-lg self-start">
          <div className="rounded-t-lg rounded-bl-lg bg-gray-100 p-2 shadow">
            <div className="font-bold capitalize text-gray-600">{role}:</div>
            <div>{content}</div>
          </div>
        </div>
      )}
    </div>
  );
}
