import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, MapPin, Star, MessageCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ExploreItem {
  id: string;
  type: 'community' | 'person' | 'event';
  data: any;
}

const Explore = () => {
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Sample data
  const communities = [
    {
      id: 1,
      name: "AI Innovators Hub",
      description: "A community of AI enthusiasts pushing the boundaries of technology",
      members: 2500,
      category: "Technology",
      image: "/placeholder.svg",
      trending: true
    },
    {
      id: 2,
      name: "Voice Tech Pioneers",
      description: "Exploring the future of voice interfaces and conversational AI",
      members: 1200,
      category: "Voice Technology",
      image: "/placeholder.svg",
      trending: false
    },
    {
      id: 3,
      name: "Digital Creators Collective",
      description: "Where creativity meets technology in the digital age",
      members: 3800,
      category: "Creative",
      image: "/placeholder.svg",
      trending: true
    },
    {
      id: 4,
      name: "ML Research Network",
      description: "Cutting-edge machine learning research and discussions",
      members: 1800,
      category: "Research",
      image: "/placeholder.svg",
      trending: false
    },
    {
      id: 5,
      name: "Startup AI Founders",
      description: "Building the next generation of AI-powered startups",
      members: 950,
      category: "Entrepreneurship",
      image: "/placeholder.svg",
      trending: true
    }
  ];

  const people = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "AI Research Scientist",
      company: "TechCorp",
      expertise: ["Machine Learning", "NLP", "Voice AI"],
      followers: 15200,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      title: "Voice UX Designer",
      company: "VoiceFlow",
      expertise: ["Voice Design", "UX", "Conversational AI"],
      followers: 8900,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Dr. Elena Vasquez",
      title: "AI Ethics Researcher",
      company: "AI Institute",
      expertise: ["AI Ethics", "Policy", "Research"],
      followers: 12400,
      image: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Alex Kim",
      title: "ML Engineer",
      company: "DataFlow",
      expertise: ["Deep Learning", "Computer Vision", "MLOps"],
      followers: 7800,
      image: "/placeholder.svg"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Voice AI Summit 2024",
      date: "March 15, 2024",
      time: "9:00 AM PST",
      location: "San Francisco, CA",
      attendees: 500,
      type: "Conference",
      virtual: false
    },
    {
      id: 2,
      title: "Conversational AI Workshop",
      date: "March 22, 2024",
      time: "2:00 PM EST",
      location: "Virtual",
      attendees: 150,
      type: "Workshop",
      virtual: true
    },
    {
      id: 3,
      title: "AI Community Meetup",
      date: "March 28, 2024",
      time: "6:00 PM PST",
      location: "New York, NY",
      attendees: 80,
      type: "Meetup",
      virtual: false
    },
    {
      id: 4,
      title: "Deep Learning Bootcamp",
      date: "April 5, 2024",
      time: "10:00 AM EST",
      location: "Boston, MA",
      attendees: 200,
      type: "Workshop",
      virtual: false
    }
  ];

  const loadMoreItems = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newItems: ExploreItem[] = [];
      const startIndex = Math.floor(items.length / 3);
      
      // Mix different types of content
      const itemTypes = ['community', 'person', 'event'] as const;
      
      for (let i = 0; i < 6; i++) {
        const typeIndex = (startIndex + i) % 3;
        const type = itemTypes[typeIndex];
        
        let data;
        let id;
        
        switch (type) {
          case 'community':
            const communityIndex = (startIndex + i) % communities.length;
            data = communities[communityIndex];
            id = `community-${data.id}-${startIndex + i}`;
            break;
          case 'person':
            const personIndex = (startIndex + i) % people.length;
            data = people[personIndex];
            id = `person-${data.id}-${startIndex + i}`;
            break;
          case 'event':
            const eventIndex = (startIndex + i) % events.length;
            data = events[eventIndex];
            id = `event-${data.id}-${startIndex + i}`;
            break;
        }
        
        newItems.push({ id, type, data });
      }
      
      setItems(prev => [...prev, ...newItems]);
      setLoading(false);
      
      // Stop loading after 50 items for demo
      if (items.length + newItems.length > 50) {
        setHasMore(false);
      }
    }, 800);
  }, [items.length, loading, hasMore]);

  // Initial load
  useEffect(() => {
    loadMoreItems();
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreItems();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreItems]);

  const renderCommunityCard = (community: any) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-[hsl(var(--voice-primary))]/30 break-inside-avoid mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Avatar className="h-12 w-12">
            <AvatarImage src={community.image} alt={community.name} />
            <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--voice-primary))] to-[hsl(var(--voice-secondary))] text-white">
              {community.name.split(' ').map(word => word[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {community.trending && (
            <Badge variant="secondary" className="bg-[hsl(var(--voice-accent))]/10 text-[hsl(var(--voice-accent))] border-[hsl(var(--voice-accent))]/20">
              <Star className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg group-hover:text-[hsl(var(--voice-primary))] transition-colors">
          {community.name}
        </CardTitle>
        <CardDescription>{community.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-xs">
            {community.category}
          </Badge>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            {community.members.toLocaleString()}
          </span>
        </div>
        <Button className="w-full bg-gradient-to-r from-[hsl(var(--voice-primary))] to-[hsl(var(--voice-secondary))] hover:opacity-90">
          Join Community
        </Button>
      </CardContent>
    </Card>
  );

  const renderPersonCard = (person: any) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-[hsl(var(--voice-primary))]/30 break-inside-avoid mb-4">
      <CardHeader className="text-center">
        <Avatar className="h-16 w-16 mx-auto mb-3">
          <AvatarImage src={person.image} alt={person.name} />
          <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--voice-primary))] to-[hsl(var(--voice-secondary))] text-white">
            {person.name.split(' ').map(name => name[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-lg group-hover:text-[hsl(var(--voice-primary))] transition-colors">
          {person.name}
        </CardTitle>
        <CardDescription>
          {person.title} at {person.company}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {person.expertise.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-muted-foreground text-center">
            {person.followers.toLocaleString()} followers
          </div>
          <Button variant="outline" className="w-full hover:bg-[hsl(var(--voice-primary))]/10 hover:border-[hsl(var(--voice-primary))]/30">
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderEventCard = (event: any) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-[hsl(var(--voice-primary))]/30 break-inside-avoid mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Badge 
            variant={event.type === 'Conference' ? 'default' : event.type === 'Workshop' ? 'secondary' : 'outline'}
            className={event.type === 'Conference' ? 'bg-[hsl(var(--voice-primary))] hover:bg-[hsl(var(--voice-primary))]/90' : ''}
          >
            {event.type}
          </Badge>
          {event.virtual && (
            <Badge variant="outline" className="text-[hsl(var(--voice-accent))] border-[hsl(var(--voice-accent))]/30">
              Virtual
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg group-hover:text-[hsl(var(--voice-primary))] transition-colors">
          {event.title}
        </CardTitle>
        <CardDescription className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            {event.date} at {event.time}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            {event.location}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            {event.attendees} attendees
          </span>
        </div>
        <Button className="w-full bg-gradient-to-r from-[hsl(var(--voice-primary))] to-[hsl(var(--voice-secondary))] hover:opacity-90">
          Register Now
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
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
                  Explore
                </h1>
                <p className="text-muted-foreground text-sm">Discover everything in one beautiful feed</p>
              </div>
            </div>
            <Link to="/discovery">
              <Button variant="outline" size="sm">
                View by Category
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-0">
          {items.map((item) => (
            <div key={item.id}>
              {item.type === 'community' && renderCommunityCard(item.data)}
              {item.type === 'person' && renderPersonCard(item.data)}
              {item.type === 'event' && renderEventCard(item.data)}
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more content...
            </div>
          </div>
        )}

        {!hasMore && items.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            You've reached the end of the feed
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;