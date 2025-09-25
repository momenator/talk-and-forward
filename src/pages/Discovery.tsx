import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, MapPin, Star, MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Discovery = () => {
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
    }
  ];

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
        <Tabs defaultValue="communities" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="communities" className="gap-2">
              <Users className="h-4 w-4" />
              Communities
            </TabsTrigger>
            <TabsTrigger value="people" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              People
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="communities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community) => (
                <Card key={community.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-[hsl(var(--voice-primary))]/30">
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
                        {community.members.toLocaleString()} members
                      </span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-[hsl(var(--voice-primary))] to-[hsl(var(--voice-secondary))] hover:opacity-90">
                      Join Community
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="people" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {people.map((person) => (
                <Card key={person.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-[hsl(var(--voice-primary))]/30">
                  <CardHeader className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={person.image} alt={person.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--voice-primary))] to-[hsl(var(--voice-secondary))] text-white text-lg">
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
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {person.expertise.map((skill) => (
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
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-[hsl(var(--voice-primary))]/30">
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
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Discovery;