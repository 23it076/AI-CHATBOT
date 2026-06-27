import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { prepareChatMessages, getChatCompletion } from "@/lib/groq";
import { saveChatMessage, getChatMessages } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import AuthModal from "@/components/AuthModal";
import { Plus, Paperclip, Send } from "lucide-react";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const chatContainerRef = useRef(null);

  // Fetch messages from Firebase when user logs in
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser) {
        const welcomeMessage = {
          id: 0,
          content: "Hi there! I'm StudyAI, your intelligent educational assistant. What would you like to know?",
          isUserMessage: false,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        return;
      }

      setIsLoadingMessages(true);
      try {
        const firebaseMessages = await getChatMessages(currentUser.uid);

        if (firebaseMessages && firebaseMessages.length > 0) {
          const formattedMessages = firebaseMessages.map((msg) => ({
            id: msg.id || Date.now().toString(),
            content: msg.content,
            isUserMessage: msg.isUserMessage,
            timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
          }));
          setMessages(formattedMessages);
        } else {
          const welcomeMessage = {
            id: Date.now().toString(),
            content: "Hi there! I'm StudyAI, your intelligent educational assistant. What would you like to know?",
            isUserMessage: false,
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);

          await saveChatMessage({
            content: welcomeMessage.content,
            isUserMessage: welcomeMessage.isUserMessage,
            userId: currentUser.uid
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load chat history. Please try again.",
          variant: "destructive"
        });
        const welcomeMessage = {
          id: Date.now().toString(),
          content: "Hi there! I'm StudyAI, your intelligent educational assistant. What would you like to know?",
          isUserMessage: false,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [currentUser, toast]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    const userMessage = {
      id: Date.now(),
      content: input.trim(),
      isUserMessage: true,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await saveChatMessage({
        content: userMessage.content,
        isUserMessage: true,
        userId: currentUser.uid
      });

      const chatHistory = messages.map((msg) => ({
        role: msg.isUserMessage ? "user" : "assistant",
        content: msg.content
      }));

      chatHistory.push({
        role: "user",
        content: userMessage.content
      });

      const chatMessages = prepareChatMessages(chatHistory);
      const completion = await getChatCompletion(chatMessages);

      if (completion && completion.choices && completion.choices.length > 0) {
        const aiResponse = completion.choices[0].message.content;

        const aiMessage = {
          id: Date.now() + 1,
          content: aiResponse,
          isUserMessage: false,
          timestamp: new Date()
        };

        setMessages((prev) => [...prev, aiMessage]);

        await saveChatMessage({
          content: aiResponse,
          isUserMessage: false,
          userId: currentUser.uid
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Mock recent chats
  const recentChats = [
    { title: "Gujarat University admission...", time: "12:32 PM" },
    { title: "Top engineering colleges...", time: "11:15 AM" },
    { title: "GUJCET exam details...", time: "Yesterday" },
    { title: "Scholarship for SC students", time: "2 days ago" },
    { title: "Civil engineering cutoffs...", time: "3 days ago" },
  ];

  return (
    <div className="flex h-[calc(100vh-80px)] w-full bg-background overflow-hidden">
      
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-80 bg-card border-r border-border p-4 shrink-0 shadow-sm z-10">
        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-6 rounded-xl flex items-center justify-start gap-3 shadow-md shadow-primary/20 font-semibold mb-6">
          <Plus className="w-5 h-5" />
          New Chat
        </Button>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Recent Chats</h3>
          <div className="space-y-1">
            {recentChats.map((chat, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors group"
              >
                <span className="text-sm font-medium text-foreground truncate pr-4">{chat.title}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-sm font-medium text-primary hover:text-primary hover:bg-primary/5">
            View All
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative w-full max-w-5xl mx-auto border-x border-border bg-background shadow-2xl">
        
        {/* Chat Header */}
        <div className="flex items-center px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-4">
            <i className="fas fa-graduation-cap text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              StudentGuideAI
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">AI</span>
            </h2>
            <p className="text-xs text-muted-foreground">Your academic companion</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {isLoadingMessages ? (
            <div className="space-y-6 animate-pulse">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-64 rounded-md" />
                  <Skeleton className="h-4 w-48 rounded-md" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-12 w-64 rounded-t-2xl rounded-bl-2xl" />
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex items-end gap-3 ${message.isUserMessage ? "justify-end" : "justify-start"}`}
              >
                {!message.isUserMessage && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 mb-1">
                    <i className="fas fa-graduation-cap text-white text-sm"></i>
                  </div>
                )}
                
                <div className={`flex flex-col ${message.isUserMessage ? "items-end" : "items-start"}`}>
                  <div 
                    className={`px-5 py-3.5 max-w-[85%] md:max-w-2xl text-sm leading-relaxed shadow-sm ${
                      message.isUserMessage 
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl rounded-bl-2xl" 
                        : "bg-card border border-border text-foreground rounded-t-2xl rounded-br-2xl"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1.5 px-1 font-medium">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.isUserMessage && <i className="fas fa-check ml-1"></i>}
                  </span>
                </div>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-end gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 mb-1">
                <i className="fas fa-graduation-cap text-white text-sm"></i>
              </div>
              <div className="bg-card border border-border rounded-t-2xl rounded-br-2xl px-5 py-4 flex items-center gap-1 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-border">
          <form 
            onSubmit={handleSubmit} 
            className="flex items-end gap-2 bg-card border border-border p-2 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all"
          >
            <Textarea
              id="message-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleEnterKey}
              placeholder="Type your message..."
              className="flex-grow min-h-[44px] max-h-[150px] bg-transparent border-none shadow-none focus-visible:ring-0 resize-none py-3 text-sm text-foreground placeholder:text-muted-foreground"
              disabled={isLoading} 
            />
            
            <div className="flex items-center gap-2 pb-1 pr-1 shrink-0">
              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl h-10 w-10">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button
                type="submit"
                size="icon"
                className={`rounded-xl h-10 w-10 transition-all ${
                  input.trim() && !isLoading 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p className="text-[10px] text-muted-foreground font-medium tracking-wide">
              StudentGuideAI can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>

      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        isLogin={true}
        setIsLogin={() => {}} 
      />
    </div>
  );
};

export default ChatPage;