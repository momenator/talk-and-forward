import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, Calendar, MapPin, Star, MessageCircle, ArrowLeft, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface DiscoveryItem {
  id?: number;
  name: string;
  description: string;
  category: string;
  reason: string;
  image?: string;
}

interface EventItem {
  id?: number;
  event_name: string;
  datetime: string;
  location: string;
  description: string;
  url?: string;
}

const Discovery = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [items, setItems] = useState<DiscoveryItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const location = useLocation();

  const dummyItems = [
    {
      id: 1,
      name: "AI Innovators Hub",
      description: "A community of AI enthusiasts pushing the boundaries of technology",
      category: "Community",
      reason: "Active discussions about cutting-edge AI research and development",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Voice Tech Pioneers",
      description: "Exploring the future of voice interfaces and conversational AI",
      category: "Community",
      reason: "Leading community for voice technology professionals",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Sarah Chen",
      description: "AI Research Scientist at TechCorp specializing in Machine Learning and NLP",
      category: "Expert",
      reason: "Renowned expert in voice AI with 15K+ followers",
      image: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Marcus Rodriguez",
      description: "Voice UX Designer creating intuitive conversational interfaces",
      category: "Expert",
      reason: "Leading voice UX designer with innovative design principles",
      image: "/placeholder.svg"
    },
    {
      id: 5,
      name: "Voice AI Summit 2024",
      description: "Premier conference for voice AI professionals and researchers",
      category: "Event",
      reason: "Largest gathering of voice AI experts with 500+ attendees",
      image: "/placeholder.svg"
    },
    {
      id: 6,
      name: "Conversational AI Workshop",
      description: "Hands-on workshop covering latest conversational AI techniques",
      category: "Event",
      reason: "Practical learning opportunity with industry leaders",
      image: "/placeholder.svg"
    }
  ];

  // Initialize items based on location state or use dummy data
  useEffect(() => {
    const discoveryItems = location.state?.discoveryItems;
    if (discoveryItems && Array.isArray(discoveryItems)) {
      // Map API data to our format, adding missing fields
      const formattedItems = discoveryItems.map((item: any, index: number) => ({
        id: item.id || index + 1,
        name: item.name || "Unknown",
        description: item.description || "No description available",
        category: item.category || "Other", 
        reason: item.reason || "No specific reason provided",
        image: item.image || "/placeholder.svg"
      }));
      setItems(formattedItems);
    } else {
      // Use dummy data as fallback
      setItems(dummyItems);
    }
  }, [location.state]);

  const fetchEvents = async (groupName: string) => {
    setIsLoadingEvents(true);
    try {
      const response = await fetch(`http://localhost:5555/events?name=${encodeURIComponent(groupName)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.results && Array.isArray(data.results)) {
          const formattedEvents = data.results.map((event: any, index: number) => ({
            id: index + 1,
            event_name: event.event_name || "Unknown Event",
            datetime: event.datetime || "TBD", 
            location: event.location || "TBD",
            description: event.description || "No description available",
            url: event.url
          }));
          setEvents(formattedEvents);
        } else {
          setEvents([]);
        }
      } else {
        console.error("Failed to fetch events");
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const toggleFavorite = (itemId: number) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Voice Agent
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--voice-primary))] to-[hsl(var(--voice-accent))] bg-clip-text text-transparent">
                  Discovery Hub
                </h1>
                <p className="text-muted-foreground text-sm">Explore communities, connect with people, join events</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <Dialog key={item.id} onOpenChange={(open) => {
              if (open) {
                fetchEvents(item.name);
              }
            }}>
              <DialogTrigger asChild>
                <Card className="group hover:shadow-voice transition-all duration-300 border-2 border-voice-primary/20 hover:border-voice-primary/50 cursor-pointer overflow-hidden bg-card/80 backdrop-blur-sm shadow-glow/20 relative">
                  {/* Star button in top-right corner */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 bg-card/80 backdrop-blur-sm hover:bg-card/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Star 
                      className={`h-4 w-4 ${
                        favorites.includes(item.id) 
                          ? 'fill-voice-accent text-voice-accent' 
                          : 'text-muted-foreground hover:text-voice-accent'
                      }`} 
                    />
                  </Button>

                  {/* Instagram-style half image at top */}
                  <div className="relative h-32 overflow-hidden bg-gradient-voice/20">
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                      style={{
                        backgroundImage: `url(${item.image})`,
                        backgroundPosition: 'center 30%'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/60" />
                  </div>
                  
                  <CardContent className="p-4">
                    {/* Instagram-style profile header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-voice-primary/30">
                          <AvatarImage src={item.image} alt={item.name} />
                          <AvatarFallback className="bg-gradient-voice text-white text-sm">
                            {item.name.split(' ').map(word => word[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-base group-hover:text-voice-primary transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                          <Badge variant="outline" className="text-xs mt-1 border-voice-primary/30 text-voice-primary">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="w-8 h-8 bg-gradient-voice/20 border-2 border-voice-primary/40 rounded-full flex items-center justify-center cursor-help hover:bg-gradient-voice/30 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <HelpCircle className="h-4 w-4 text-voice-primary" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs p-3 bg-card border border-voice-primary/30 shadow-voice">
                            <div className="flex items-start gap-2">
                              <div className="w-1 h-4 bg-voice-primary rounded-full flex-shrink-0 mt-1" />
                              <div>
                                <p className="text-xs font-semibold text-voice-primary mb-1">Why This Matters</p>
                                <p className="text-xs text-foreground/90 leading-relaxed">
                                  {item.reason}
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    {/* Content */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item.image} alt={item.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--voice-primary))] to-[hsl(var(--voice-secondary))] text-white">
                        {item.name.split(' ').map(word => word[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {item.name}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{item.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    
                    <div className="bg-gradient-voice/15 rounded-lg p-4 border-2 border-voice-primary/30 shadow-inner">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-8 bg-voice-primary rounded-full flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-voice-primary mb-3 flex items-center gap-2 text-lg">
                            <MessageCircle className="h-5 w-5" />
                            Why This Matters
                          </h4>
                          <p className="text-base leading-relaxed font-medium text-foreground/90">
                            {item.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                   <div>
                     <h4 className="font-semibold mb-3 flex items-center gap-2">
                       <Calendar className="h-4 w-4" />
                       Related Events
                     </h4>
                     {isLoadingEvents ? (
                       <div className="space-y-3">
                         {[1, 2, 3].map((i) => (
                           <div key={i} className="p-3 border border-border rounded-lg">
                             <div className="space-y-2">
                               <div className="h-4 bg-muted rounded animate-pulse" />
                               <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                             </div>
                           </div>
                         ))}
                       </div>
                     ) : events.length > 0 ? (
                       <div className="space-y-3">
                         {events.map((event) => (
                           <div key={event.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                             <div>
                               <h5 className="font-medium text-sm">{event.event_name}</h5>
                               <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                 <span className="flex items-center gap-1">
                                   <Calendar className="h-3 w-3" />
                                   {event.datetime}
                                 </span>
                                 <span className="flex items-center gap-1">
                                   <MapPin className="h-3 w-3" />
                                   {event.location}
                                 </span>
                               </div>
                               {event.description && (
                                 <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                   {event.description}
                                 </p>
                               )}
                             </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  if (event.url) {
                                    window.open(event.url, '_blank');
                                  }
                                }}
                                disabled={!event.url}
                              >
                                View
                              </Button>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="text-center py-6 text-muted-foreground">
                         <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                         <p className="text-sm">No events found for this group</p>
                       </div>
                     )}
                   </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Discovery;