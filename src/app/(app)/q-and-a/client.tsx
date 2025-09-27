
"use client";

import { useState, useRef, useEffect } from "react";
import { answerDietWellnessQuestions } from "@/ai/flows/answer-diet-wellness-questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: number;
  role: "user" | "assistant" | "loading";
  content: string;
};

export function QAndAClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };
    const loadingMessage: Message = {
      id: Date.now() + 1,
      role: "loading",
      content: "...",
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");

    try {
      const result = await answerDietWellnessQuestions({ question: input });
      const assistantMessage: Message = {
        id: Date.now() + 2,
        role: "assistant",
        content: result.answer,
      };
      setMessages((prev) => [...prev.slice(0, -1), assistantMessage]);
    } catch (error: any) {
      console.error("Error fetching answer:", error);
      let errorMessageContent = "Sorry, I encountered an error. Please try again.";
      if (error.message && error.message.includes("503")) {
        errorMessageContent = "The AI service is temporarily unavailable. Please try again in a few moments.";
      }
      const errorMessage: Message = {
        id: Date.now() + 2,
        role: "assistant",
        content: errorMessageContent,
      };
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
    }
  };
  
  const formatText = (text: string) => {
    return text
      .replace(/^#\s(.*?)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^##\s(.*?)$/gm, '<h3 class="text-lg font-bold mt-3 mb-1">$1</h3>')
      .replace(/^###\s(.*?)$/gm, '<h4 class="text-md font-bold mt-2 mb-1">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\*\s(.*?)$/gm, '<li>$1</li>')
      .replace(/^\s*\-\s(.*?)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/<li>(.*?)<ul>/gs, '<li>$1<ul class="pl-4">')
      .replace(/<\/ul>\n<ul>/gs, '')
      .replace(/(\r\n|\n|\r)/gm, "<br />")
      .replace(/<br \/>\n*<br \/>/gm, '<br />')
      .replace(/<ul><br \/>/g, '<ul>')
      .replace(/<br \/>\s*<\/ul>/g, '</ul>');
  };

  return (
    <div className="flex flex-col flex-1 mt-8 bg-card border rounded-lg shadow-sm">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground pt-16">
              <Sparkles className="mx-auto h-12 w-12" />
              <p className="mt-4">Ask me anything about Ayurveda!</p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-4",
                message.role === "user" && "justify-end"
              )}
            >
              {message.role !== "user" && (
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Sparkles className="size-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-md rounded-lg px-4 py-3 prose prose-sm dark:prose-invert max-w-none font-body",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted",
                  message.role === "loading" && "animate-pulse"
                )}
              >
                {message.role === "loading" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                   <div dangerouslySetInnerHTML={{ __html: formatText(message.content) }} />
                )}
              </div>
              {message.role === "user" && (
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    <User className="size-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
