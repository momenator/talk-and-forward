import { useState, useEffect, useCallback, useRef } from "react";
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
  x: number;
  y: number;
}

const Explore = () => {
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [momentum, setMomentum] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

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

  const generateRandomPosition = (index: number) => {
    // Create a spiral pattern with some randomness
    const angle = index * 0.5;
    const radius = Math.sqrt(index) * 200;
    const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 300;
    const y = Math.sin(angle) * radius + (Math.random() - 0.5) * 300;
    return { x, y };
  };

  const loadMoreItems = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newItems: ExploreItem[] = [];
      const startIndex = items.length;
      
      // Mix different types of content
      const itemTypes = ['community', 'person', 'event'] as const;
      
      for (let i = 0; i < 12; i++) {
        const typeIndex = (startIndex + i) % 3;
        const type = itemTypes[typeIndex];
        const position = generateRandomPosition(startIndex + i);
        
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
        
        newItems.push({ id, type, data, x: position.x, y: position.y });
      }
      
      setItems(prev => [...prev, ...newItems]);
      setLoading(false);
      
      // Stop loading after 100 items for demo
      if (items.length + newItems.length > 100) {
        setHasMore(false);
      }
    }, 800);
  }, [items.length, loading, hasMore]);

  // Initial load
  useEffect(() => {
    loadMoreItems();
  }, []);

  // Load more items when near edge of visible area
  useEffect(() => {
    const checkLoadMore = () => {
      if (!hasMore || loading) return;
      
      const viewportBounds = {
        left: -viewportOffset.x - 1000,
        right: -viewportOffset.x + window.innerWidth + 1000,
        top: -viewportOffset.y - 1000,
        bottom: -viewportOffset.y + window.innerHeight + 1000
      };
      
      const visibleItems = items.filter(item => 
        item.x > viewportBounds.left &&
        item.x < viewportBounds.right &&
        item.y > viewportBounds.top &&
        item.y < viewportBounds.bottom
      );
      
      if (visibleItems.length < 20) {
        loadMoreItems();
      }
    };
    
    checkLoadMore();
  }, [viewportOffset, items, hasMore, loading, loadMoreItems]);

  // Mouse/touch drag controls
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      setMomentum({ x: 0, y: 0 });
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      
      setViewportOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setMomentum({ x: deltaX, y: deltaY });
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      
      // Apply momentum
      const applyMomentum = () => {
        setMomentum(prev => {
          const friction = 0.95;
          const newMomentum = {
            x: prev.x * friction,
            y: prev.y * friction
          };
          
          if (Math.abs(newMomentum.x) > 0.1 || Math.abs(newMomentum.y) > 0.1) {
            setViewportOffset(offset => ({
              x: offset.x + newMomentum.x,
              y: offset.y + newMomentum.y
            }));
            
            animationRef.current = requestAnimationFrame(applyMomentum);
          }
          
          return newMomentum;
        });
      };
      
      if (Math.abs(momentum.x) > 1 || Math.abs(momentum.y) > 1) {
        applyMomentum();
      }
    };

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX, y: touch.clientY });
      lastMousePos.current = { x: touch.clientX, y: touch.clientY };
      setMomentum({ x: 0, y: 0 });
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastMousePos.current.x;
      const deltaY = touch.clientY - lastMousePos.current.y;
      
      setViewportOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setMomentum({ x: deltaX, y: deltaY });
      lastMousePos.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = () => {
      handleMouseUp();
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, momentum]);

  // Zoom with mouse wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Zoom towards mouse position
      setViewportOffset(prev => ({
        x: mouseX - (mouseX - prev.x) * zoomFactor,
        y: mouseY - (mouseY - prev.y) * zoomFactor
      }));
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

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

      <main 
        ref={containerRef}
        className="relative h-[calc(100vh-80px)] overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ userSelect: 'none' }}
      >
        <div 
          className="absolute inset-0"
          style={{
            transform: `translate(${viewportOffset.x}px, ${viewportOffset.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {items.map((item) => (
            <div 
              key={item.id}
              className="absolute"
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: '300px',
                pointerEvents: 'auto'
              }}
            >
              {item.type === 'community' && renderCommunityCard(item.data)}
              {item.type === 'person' && renderPersonCard(item.data)}
              {item.type === 'event' && renderEventCard(item.data)}
            </div>
          ))}
          
          {/* Center indicator */}
          <div 
            className="absolute w-2 h-2 bg-[hsl(var(--voice-primary))] rounded-full opacity-30"
            style={{ left: '-4px', top: '-4px' }}
          />
        </div>

        {loading && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
            <div className="flex items-center gap-2 text-muted-foreground bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more content...
            </div>
          </div>
        )}

        {/* Navigation hint */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="text-sm text-muted-foreground bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
            Drag to explore • Scroll to zoom
          </div>
        </div>

        {/* Reset button */}
        <div className="absolute top-4 right-4">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-card/80 backdrop-blur-sm border-border/50"
            onClick={() => setViewportOffset({ x: 0, y: 0 })}
          >
            Reset View
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Explore;