import VoiceConversation from "@/components/VoiceConversation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();

  const handleConversationEnd = async (conversationId: string) => {
    console.log("Conversation ended with ID:", conversationId);
    
    // You can customize this API call to forward the conversation ID
    // to your preferred endpoint
    toast({
      title: "Conversation Completed",
      description: `Ready to forward conversation ID: ${conversationId.slice(0, 8)}...`,
    });
  };

  return (
    <div className="min-h-screen">
      <div className="p-4 border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Voice Assistant</h1>
          <div className="space-x-4">
            <Button asChild variant="outline">
              <Link to="/discovery">Discovery</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/explore">Explore</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/graph">3D Graph</Link>
            </Button>
          </div>
        </div>
      </div>
      <VoiceConversation onConversationEnd={handleConversationEnd} />
    </div>
  );
};

export default Index;