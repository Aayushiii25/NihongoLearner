import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { Bot, User, Send, Volume2 } from "lucide-react";
import LoadingSpinner from "./loading-spinner";

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
  isUser: boolean;
  suggestions?: string[];
  lesson?: {
    character?: string;
    romanji?: string;
    meaning?: string;
    example?: string;
  };
}

export default function Chatbot() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      message: "",
      response: "こんにちは！日本語を勉強しましょう！\nHello! Let's study Japanese together!",
      timestamp: new Date(),
      isUser: false,
      suggestions: ["Learn Hiragana", "Practice Vocabulary", "Cultural Facts"],
    },
  ]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        message: inputMessage,
        response: data.message,
        timestamp: new Date(),
        isUser: false,
        suggestions: data.suggestions,
        lesson: data.lesson,
      };
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + "_user",
          message: inputMessage,
          response: "",
          timestamp: new Date(),
          isUser: true,
        },
        newMessage
      ]);
      setInputMessage("");
    },
  });

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      chatMutation.mutate(inputMessage);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    chatMutation.mutate(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto lg:mx-0 h-[500px] flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-sakura-50 rounded-t-lg">
          <div className="w-12 h-12 bg-sakura-gradient rounded-full flex items-center justify-center mr-3">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-japanese-charcoal font-japanese">Nihongo Sensei</h3>
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              {msg.isUser ? (
                <div className="flex justify-end">
                  <div className="bg-sakura-gradient rounded-2xl rounded-br-md p-3 max-w-xs text-white">
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md p-3 max-w-xs">
                    <div className="text-sm text-japanese-charcoal whitespace-pre-line">
                      {msg.response}
                    </div>
                    {msg.lesson && (
                      <div className="mt-3 p-2 bg-sakura-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-2xl font-japanese">{msg.lesson.character}</span>
                          <Button variant="ghost" size="sm">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600">
                          <strong>{msg.lesson.romanji}</strong> - {msg.lesson.meaning}
                        </p>
                        {msg.lesson.example && (
                          <p className="text-xs text-gray-500 mt-1">{msg.lesson.example}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-sakura-200 transition-colors bg-sakura-100 text-sakura-700"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {chatMutation.isPending && (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              disabled={chatMutation.isPending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || chatMutation.isPending}
              className="bg-sakura-gradient hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
