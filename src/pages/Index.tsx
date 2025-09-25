import VoiceConversation from "@/components/VoiceConversation";
import { useToast } from "@/hooks/use-toast";

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
      <VoiceConversation onConversationEnd={handleConversationEnd} />
    </div>
  );
};

export default Index;