import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Smile,
  Search,
  Users,
  Clock,
  CheckCheck,
  AlertCircle,
  Star,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: "text" | "image" | "file" | "order" | "system";
  metadata?: any;
  created_at: string;
  read: boolean;
  sender?: {
    name: string;
    avatar?: string;
    type: "retailer" | "supplier" | "logistics";
  };
}

interface Conversation {
  id: string;
  participants: string[];
  type: "direct" | "group" | "support";
  title?: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  participants_data?: Array<{
    id: string;
    name: string;
    avatar?: string;
    type: string;
    online: boolean;
  }>;
}

const ChatMessage = ({
  message,
  isCurrentUser,
}: {
  message: ChatMessage;
  isCurrentUser: boolean;
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessageContent = () => {
    switch (message.message_type) {
      case "order":
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-blue-600">Order</Badge>
            </div>
            <div className="text-sm">
              <p className="font-medium">
                Order #{message.metadata?.orderNumber}
              </p>
              <p className="text-gray-600">
                KES {message.metadata?.amount?.toLocaleString()}
              </p>
            </div>
            <Button size="sm" className="mt-2 w-full">
              View Order
            </Button>
          </div>
        );
      case "system":
        return (
          <div className="bg-gray-100 rounded-lg p-2 text-sm text-gray-600 italic">
            {message.content}
          </div>
        );
      default:
        return (
          <div
            className={`rounded-lg p-3 max-w-xs break-words ${
              isCurrentUser
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            {message.content}
          </div>
        );
    }
  };

  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={message.sender?.avatar} />
          <AvatarFallback>
            {message.sender?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}
      >
        {!isCurrentUser && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-medium text-gray-600">
              {message.sender?.name}
            </span>
            <Badge
              variant="outline"
              className={`text-xs ${
                message.sender?.type === "supplier"
                  ? "text-blue-600 border-blue-300"
                  : message.sender?.type === "logistics"
                    ? "text-purple-600 border-purple-300"
                    : "text-green-600 border-green-300"
              }`}
            >
              {message.sender?.type === "supplier"
                ? "🐘"
                : message.sender?.type === "logistics"
                  ? "🐆"
                  : "🦌"}
              {message.sender?.type}
            </Badge>
          </div>
        )}

        {renderMessageContent()}

        <div
          className={`flex items-center space-x-1 mt-1 ${isCurrentUser ? "text-gray-500" : "text-gray-400"}`}
        >
          <span className="text-xs">{formatTime(message.created_at)}</span>
          {isCurrentUser && (
            <CheckCheck
              className={`h-3 w-3 ${message.read ? "text-green-500" : "text-gray-400"}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  searchQuery,
  onSearchChange,
}: {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) => {
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participants_data?.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const formatLastMessageTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours =
      (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return messageTime.toLocaleDateString();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedConversation === conversation.id
                  ? "bg-green-50 border border-green-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {conversation.participants_data
                      ?.slice(0, 2)
                      .map((participant, index) => (
                        <div key={participant.id} className="relative">
                          <Avatar className="h-8 w-8 border-2 border-white">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback className="text-xs">
                              {participant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {participant.online && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                      ))}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {conversation.title ||
                        conversation.participants_data
                          ?.map((p) => p.name)
                          .join(", ")}
                    </p>
                    <div className="flex items-center space-x-1">
                      {conversation.participants_data?.map((p) => (
                        <Badge key={p.id} variant="outline" className="text-xs">
                          {p.type === "supplier"
                            ? "🐘"
                            : p.type === "logistics"
                              ? "🐆"
                              : "🦌"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <span className="text-xs text-gray-500">
                    {formatLastMessageTime(conversation.last_message_at)}
                  </span>
                  {conversation.unread_count > 0 && (
                    <Badge className="bg-green-600 text-white text-xs">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 truncate">
                {conversation.last_message}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const ChatWindow = ({
  conversationId,
  messages,
  onSendMessage,
  conversation,
}: {
  conversationId: string;
  messages: ChatMessage[];
  onSendMessage: (content: string, type?: string) => void;
  conversation?: Conversation;
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-1">
            {conversation?.participants_data?.slice(0, 3).map((participant) => (
              <Avatar
                key={participant.id}
                className="h-8 w-8 border-2 border-white"
              >
                <AvatarImage src={participant.avatar} />
                <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div>
            <h3 className="font-medium">
              {conversation?.title ||
                conversation?.participants_data?.map((p) => p.name).join(", ")}
            </h3>
            <p className="text-sm text-gray-500">
              {conversation?.participants_data?.filter((p) => p.online)
                .length || 0}{" "}
              online
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isCurrentUser={message.sender_id === user?.id}
            />
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-sm">Someone is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-end space-x-2">
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ChatSystem = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Mock data - In production, this would come from Supabase
  useEffect(() => {
    if (isOpen) {
      setConversations([
        {
          id: "1",
          participants: ["user1", "user2"],
          type: "direct",
          title: "Maize Supply Discussion",
          last_message: "When can you deliver the 500kg order?",
          last_message_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          unread_count: 2,
          participants_data: [
            {
              id: "user2",
              name: "Mwangi Supplies",
              type: "supplier",
              online: true,
            },
          ],
        },
        {
          id: "2",
          participants: ["user1", "user3"],
          type: "direct",
          title: "Delivery Update",
          last_message: "Package is out for delivery",
          last_message_at: new Date(
            Date.now() - 2 * 60 * 60 * 1000,
          ).toISOString(),
          unread_count: 0,
          participants_data: [
            {
              id: "user3",
              name: "Cheetah Logistics",
              type: "logistics",
              online: false,
            },
          ],
        },
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async (content: string, type: string = "text") => {
    if (!selectedConversation) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      conversation_id: selectedConversation,
      sender_id: user?.id || "current_user",
      content,
      message_type: type as any,
      created_at: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);

    // In production, send to Supabase
    try {
      // await supabase.from('chat_messages').insert(newMessage);
      console.log("Message sent:", newMessage);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const selectedConversationData = conversations.find(
    (c) => c.id === selectedConversation,
  );
  const totalUnread = conversations.reduce(
    (total, conv) => total + conv.unread_count,
    0,
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-50">
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {totalUnread > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                {totalUnread > 9 ? "9+" : totalUnread}
              </Badge>
            )}
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl h-[600px] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Savanna Chat</span>
            <Badge variant="secondary">
              {conversations.length} conversations
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[550px]">
          {/* Conversations Sidebar */}
          <div className="w-1/3 border-r">
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Chat Window */}
          <div className="flex-1">
            <ChatWindow
              conversationId={selectedConversation || ""}
              messages={messages}
              onSendMessage={handleSendMessage}
              conversation={selectedConversationData}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatSystem;
