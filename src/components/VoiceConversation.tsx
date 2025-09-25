import { useState, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Phone, PhoneOff, Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface VoiceConversationProps {
  onConversationEnd?: (conversationId: string) => void;
}

const VoiceConversation = ({ onConversationEnd }: VoiceConversationProps) => {
  const [agentId, setAgentId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isSetup, setIsSetup] = useState(false);
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
    // Request microphone access on component mount
    const requestMicAccess = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Microphone Access Required",
          description: "Please allow microphone access to use voice features.",
        });
      }
    };

    requestMicAccess();
  }, [toast]);

  const handleStartConversation = async () => {
    if (!agentId || !apiKey) {
      toast({
        variant: "destructive",
        title: "Setup Required",
        description: "Please provide both Agent ID and API Key.",
      });
      return;
    }

    try {
      // Generate signed URL for authentication
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
        {
          method: "GET",
          headers: {
            "xi-api-key": apiKey,
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
      const response = await fetch("/api/forward-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversationId,
          timestamp: new Date().toISOString(),
        }),
      });

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

  if (!isSetup) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <Link to="/discovery">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-[hsl(var(--voice-primary))]/10">
              <Compass className="h-4 w-4" />
              Discover
            </Button>
          </Link>
        </div>
        <Card className="w-full max-w-md p-6 bg-gradient-voice border-0 shadow-voice">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Voice Agent Setup</h1>
              <p className="text-muted-foreground">
                Configure your ElevenLabs voice agent to get started
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Agent ID</label>
                <input
                  type="text"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  placeholder="Enter your ElevenLabs Agent ID"
                  className="w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-voice-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your ElevenLabs API Key"
                  className="w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-voice-primary"
                />
              </div>
            </div>

            <Button
              onClick={() => setIsSetup(true)}
              disabled={!agentId || !apiKey}
              className="w-full bg-voice-primary hover:bg-voice-secondary transition-all duration-300"
            >
              Start Voice Agent
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Link to="/discovery">
          <Button variant="outline" size="sm" className="gap-2 hover:bg-[hsl(var(--voice-primary))]/10">
            <Compass className="h-4 w-4" />
            Discover
          </Button>
        </Link>
      </div>
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

          {/* Settings */}
          <Button
            onClick={() => setIsSetup(false)}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            Change Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VoiceConversation;