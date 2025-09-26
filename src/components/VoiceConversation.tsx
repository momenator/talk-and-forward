import { useState, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Hardcoded credentials - replace with your actual values
const AGENT_ID = "test";
const API_KEY = "test";

interface VoiceConversationProps {
  onConversationEnd?: (conversationId: string) => void;
}

const VoiceConversation = ({ onConversationEnd }: VoiceConversationProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isForwarding, setIsForwarding] = useState(false);
  const { toast } = useToast();

  const conversation = useConversation({
    onConnect: () => {
      toast({
        title: "Connected",
        description: "Voice conversation started successfully.",
      });
    },
    onDisconnect: () => {
      toast({
        title: "Disconnected",
        description: "Voice conversation ended.",
      });
      if (currentConversationId) {
        handleAPIForward(currentConversationId);
        if (onConversationEnd) {
          onConversationEnd(currentConversationId);
        }
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: typeof error === 'string' ? error : (error?.message || "Failed to connect to voice agent."),
      });
    },
  });

  const { status, isSpeaking } = conversation;

  useEffect(() => {
    // Request microphone access and simulate loading
    const initialize = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        // Simulate loading time
        setTimeout(() => setIsLoading(false), 2000);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Microphone Access Required",
          description: "Please allow microphone access to use voice features.",
        });
        setIsLoading(false);
      }
    };

    initialize();
  }, [toast]);

  const handleStartConversation = async () => {
    if (!AGENT_ID || !API_KEY) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Agent ID and API Key must be configured.",
      });
      return;
    }

    try {
      // Generate signed URL for authentication
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${AGENT_ID}`,
        {
          method: "GET",
          headers: {
            "xi-api-key": API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get signed URL");
      }

      const body = await response.json();
      const conversationId = await conversation.startSession({ signedUrl: body.signed_url });
      setCurrentConversationId(conversationId);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Start Conversation",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
      setCurrentConversationId(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to end conversation properly.",
      });
    }
  };

  const handleAPIForward = async (conversationId: string) => {
    if (!conversationId) return;

    setIsForwarding(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/forward-conversation?conversationId=${conversationId}`, {
        method: "GET",
      });

      const responseData = await response.text();
      console.log("API Response:", responseData);

      if (response.ok) {
        toast({
          title: "Success",
          description: "Conversation ID forwarded successfully.",
        });
      } else {
        throw new Error("Failed to forward conversation ID");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Forward Failed",
        description: "Failed to forward conversation ID to API.",
      });
    } finally {
      setIsForwarding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-gradient-voice border-0 shadow-voice">
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">Loading Voice Agent</h1>
              <p className="text-muted-foreground mb-6">
                Initializing your voice conversation experience...
              </p>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-voice-primary border-t-transparent rounded-full animate-spin" />
              <span>Setting up...</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 bg-gradient-voice border-0 shadow-voice">
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Voice Agent</h1>
            <Badge 
              variant={status === "connected" ? "default" : "secondary"}
              className="capitalize"
            >
              {status}
            </Badge>
          </div>

          {/* Voice indicator */}
          <div className="relative">
            <div
              className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                isSpeaking
                  ? "bg-voice-accent shadow-glow animate-pulse"
                  : status === "connected"
                  ? "bg-voice-primary shadow-voice"
                  : "bg-secondary"
              }`}
            >
              {status === "connected" ? (
                isSpeaking ? (
                  <Mic className="w-12 h-12 text-white" />
                ) : (
                  <MicOff className="w-12 h-12 text-white" />
                )
              ) : (
                <Phone className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            
            {isSpeaking && (
              <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-voice-accent opacity-30 animate-ping" />
            )}
          </div>

          {/* Status text */}
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {status === "connected"
                ? isSpeaking
                  ? "Agent is speaking..."
                  : "Listening..."
                : "Ready to connect"}
            </p>
            {currentConversationId && (
              <p className="text-sm text-muted-foreground">
                ID: {currentConversationId.slice(0, 8)}...
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            {status === "disconnected" ? (
              <Button
                onClick={handleStartConversation}
                size="lg"
                className="bg-voice-success hover:bg-voice-success/90 transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Start Call
              </Button>
            ) : (
              <Button
                onClick={handleEndConversation}
                size="lg"
                variant="destructive"
                className="transition-all duration-300"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                End Call
              </Button>
            )}
          </div>

          {/* Loading indicator during forwarding */}
          {isForwarding && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-voice-primary border-t-transparent rounded-full animate-spin" />
              <span>Forwarding conversation...</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VoiceConversation;