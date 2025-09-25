import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface NodeData {
  id: string;
  label: string;
  position: [number, number]; // Only x, y for 2D
  color: string;
  size: number;
  type: 'center' | 'theme' | 'content';
  data?: {
    title: string;
    description: string;
    image: string;
    tags: string[];
  };
}

interface Connection {
  from: string;
  to: string;
}

const Node: React.FC<{
  node: NodeData;
  onClick: (node: NodeData) => void;
  isHovered: boolean;
  onHover: (node: NodeData | null) => void;
}> = ({ node, onClick, isHovered, onHover }) => {
  const radius = node.size * 20; // Scale for SVG
  const [x, y] = node.position;

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={node.color}
        stroke={isHovered ? "#ffffff" : "transparent"}
        strokeWidth={isHovered ? 3 : 0}
        className="cursor-pointer transition-all duration-200"
        style={{
          filter: isHovered ? `drop-shadow(0 0 10px ${node.color})` : 'none',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transformOrigin: `${x}px ${y}px`
        }}
        onClick={() => onClick(node)}
        onMouseEnter={() => onHover(node)}
        onMouseLeave={() => onHover(null)}
      />
      <text
        x={x}
        y={y + radius + 15}
        textAnchor="middle"
        fill="currentColor"
        className="text-sm font-medium pointer-events-none"
      >
        {node.label}
      </text>
    </g>
  );
};

const Connection: React.FC<{
  from: [number, number];
  to: [number, number];
}> = ({ from, to }) => {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke="hsl(var(--muted-foreground))"
      strokeWidth={2}
      opacity={0.4}
    />
  );
};

const NetworkGraph2D: React.FC<{
  nodes: NodeData[];
  connections: Connection[];
  onNodeClick: (node: NodeData) => void;
}> = ({ nodes, connections, onNodeClick }) => {
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);

  // Calculate SVG viewBox based on node positions
  const viewBox = useMemo(() => {
    const padding = 100;
    const xs = nodes.map(n => n.position[0]);
    const ys = nodes.map(n => n.position[1]);
    const minX = Math.min(...xs) - padding;
    const maxX = Math.max(...xs) + padding;
    const minY = Math.min(...ys) - padding;
    const maxY = Math.max(...ys) + padding;
    return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
  }, [nodes]);

  return (
    <svg
      className="w-full h-full"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Render connections first (behind nodes) */}
      {connections.map((connection, index) => {
        const fromNode = nodes.find(n => n.id === connection.from);
        const toNode = nodes.find(n => n.id === connection.to);
        if (!fromNode || !toNode) return null;
        
        return (
          <Connection
            key={index}
            from={fromNode.position}
            to={toNode.position}
          />
        );
      })}
      
      {/* Render nodes on top */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          onClick={onNodeClick}
          isHovered={hoveredNode?.id === node.id}
          onHover={setHoveredNode}
        />
      ))}
    </svg>
  );
};

const Graph2D = () => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  const nodes: NodeData[] = useMemo(() => [
    // Center node
    {
      id: 'you',
      label: 'You',
      position: [0, 0],
      color: '#6366f1',
      size: 1.5,
      type: 'center',
      data: {
        title: 'Your Profile',
        description: 'This is your central hub in the network. Explore connections to discover new communities and events.',
        image: '/placeholder.svg',
        tags: ['Profile', 'Hub', 'Center']
      }
    },
    
    // Theme nodes (first level)
    {
      id: 'ai',
      label: 'AI',
      position: [150, -80],
      color: '#10b981',
      size: 1,
      type: 'theme',
      data: {
        title: 'Artificial Intelligence',
        description: 'Explore the fascinating world of AI, machine learning, and emerging technologies.',
        image: '/placeholder.svg',
        tags: ['Technology', 'Innovation', 'Future']
      }
    },
    {
      id: 'music',
      label: 'Music',
      position: [-120, 100],
      color: '#f59e0b',
      size: 1,
      type: 'theme',
      data: {
        title: 'Music & Audio',
        description: 'Discover music communities, concerts, and audio production events.',
        image: '/placeholder.svg',
        tags: ['Audio', 'Creative', 'Entertainment']
      }
    },
    {
      id: 'sports',
      label: 'Sports',
      position: [-80, -120],
      color: '#ef4444',
      size: 1,
      type: 'theme',
      data: {
        title: 'Sports & Fitness',
        description: 'Join sports communities and fitness events in your area.',
        image: '/placeholder.svg',
        tags: ['Health', 'Community', 'Active']
      }
    },
    
    // Content nodes (second level) - AI related
    {
      id: 'ai-meetup',
      label: 'AI Meetup',
      position: [250, -40],
      color: '#34d399',
      size: 0.7,
      type: 'content',
      data: {
        title: 'Weekly AI Meetup',
        description: 'Join fellow AI enthusiasts every Thursday for discussions on the latest developments in artificial intelligence.',
        image: '/placeholder.svg',
        tags: ['Meetup', 'Weekly', 'Networking']
      }
    },
    {
      id: 'ml-workshop',
      label: 'ML Workshop',
      position: [220, -160],
      color: '#34d399',
      size: 0.7,
      type: 'content',
      data: {
        title: 'Machine Learning Workshop',
        description: 'Hands-on workshop covering practical machine learning techniques and tools.',
        image: '/placeholder.svg',
        tags: ['Workshop', 'Hands-on', 'Learning']
      }
    },
    
    // Content nodes - Music related
    {
      id: 'jazz-club',
      label: 'Jazz Club',
      position: [-220, 180],
      color: '#fbbf24',
      size: 0.7,
      type: 'content',
      data: {
        title: 'Downtown Jazz Club',
        description: 'Experience live jazz music every weekend with local and touring artists.',
        image: '/placeholder.svg',
        tags: ['Live Music', 'Jazz', 'Weekend']
      }
    },
    {
      id: 'music-production',
      label: 'Music Production',
      position: [-180, 60],
      color: '#fbbf24',
      size: 0.7,
      type: 'content',
      data: {
        title: 'Music Production Community',
        description: 'Connect with producers, learn new techniques, and collaborate on projects.',
        image: '/placeholder.svg',
        tags: ['Production', 'Collaboration', 'Creative']
      }
    },
    
    // Content nodes - Sports related
    {
      id: 'running-club',
      label: 'Running Club',
      position: [-160, -200],
      color: '#f87171',
      size: 0.7,
      type: 'content',
      data: {
        title: 'Morning Running Club',
        description: 'Start your day with a group run through the city. All fitness levels welcome!',
        image: '/placeholder.svg',
        tags: ['Running', 'Morning', 'Fitness']
      }
    },
    {
      id: 'basketball-league',
      label: 'Basketball',
      position: [20, -180],
      color: '#f87171',
      size: 0.7,
      type: 'content',
      data: {
        title: 'Local Basketball League',
        description: 'Join our competitive basketball league with games every weekend.',
        image: '/placeholder.svg',
        tags: ['Basketball', 'League', 'Competitive']
      }
    }
  ], []);

  const connections: Connection[] = useMemo(() => [
    // Center to themes
    { from: 'you', to: 'ai' },
    { from: 'you', to: 'music' },
    { from: 'you', to: 'sports' },
    
    // Themes to content
    { from: 'ai', to: 'ai-meetup' },
    { from: 'ai', to: 'ml-workshop' },
    { from: 'music', to: 'jazz-club' },
    { from: 'music', to: 'music-production' },
    { from: 'sports', to: 'running-club' },
    { from: 'sports', to: 'basketball-league' }
  ], []);

  const handleNodeClick = (node: NodeData) => {
    setSelectedNode(node);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground">2D Network Graph</h1>
          <p className="text-muted-foreground mt-2">
            Explore your connections in 2D space. Click on nodes to learn more.
          </p>
        </div>
      </header>

      <div className="h-[calc(100vh-120px)] p-4">
        <div className="w-full h-full border rounded-lg bg-card/20">
          <NetworkGraph2D
            nodes={nodes}
            connections={connections}
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>

      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent className="max-w-md">
          {selectedNode?.data && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedNode.data.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <img 
                    src={selectedNode.data.image} 
                    alt={selectedNode.data.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <p className="text-muted-foreground">{selectedNode.data.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.data.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Graph2D;