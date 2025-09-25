import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as THREE from 'three';

interface NodeData {
  id: string;
  label: string;
  position: [number, number, number];
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
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (isHovered) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(node)}
        onPointerOver={() => onHover(node)}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[node.size, 32, 32]} />
        <meshStandardMaterial 
          color={node.color}
          emissive={isHovered ? node.color : '#000000'}
          emissiveIntensity={isHovered ? 0.2 : 0}
        />
      </mesh>
      <Text
        position={[0, -node.size - 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>
    </group>
  );
};

const Connection: React.FC<{ from: [number, number, number]; to: [number, number, number] }> = ({ from, to }) => {
  const points = useMemo(() => [
    new THREE.Vector3(...from),
    new THREE.Vector3(...to)
  ], [from, to]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  return (
    <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: '#64748b', opacity: 0.6, transparent: true }))} />
  );
};

const NetworkGraph: React.FC<{
  nodes: NodeData[];
  connections: Connection[];
  onNodeClick: (node: NodeData) => void;
}> = ({ nodes, connections, onNodeClick }) => {
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} color="#blue" intensity={0.3} />
      
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
      
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          onClick={onNodeClick}
          isHovered={hoveredNode?.id === node.id}
          onHover={setHoveredNode}
        />
      ))}
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
};

const Graph = () => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  const nodes: NodeData[] = useMemo(() => [
    // Center node
    {
      id: 'you',
      label: 'You',
      position: [0, 0, 0],
      color: '#6366f1',
      size: 1.2,
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
      position: [4, 2, 0],
      color: '#10b981',
      size: 0.8,
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
      position: [-4, 1, 2],
      color: '#f59e0b',
      size: 0.8,
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
      position: [-2, -3, -1],
      color: '#ef4444',
      size: 0.8,
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
      position: [6, 4, 1],
      color: '#34d399',
      size: 0.5,
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
      position: [5, 0, -2],
      color: '#34d399',
      size: 0.5,
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
      position: [-6, 2, 4],
      color: '#fbbf24',
      size: 0.5,
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
      position: [-3, 3, 0],
      color: '#fbbf24',
      size: 0.5,
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
      position: [-4, -5, 0],
      color: '#f87171',
      size: 0.5,
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
      position: [0, -4, -3],
      color: '#f87171',
      size: 0.5,
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
          <h1 className="text-3xl font-bold text-foreground">Network Graph</h1>
          <p className="text-muted-foreground mt-2">
            Explore your connections in 3D space. Click on nodes to learn more.
          </p>
        </div>
      </header>

      <div className="h-[calc(100vh-120px)]">
        <Canvas camera={{ position: [8, 8, 8], fov: 75 }}>
          <NetworkGraph
            nodes={nodes}
            connections={connections}
            onNodeClick={handleNodeClick}
          />
        </Canvas>
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

export default Graph;