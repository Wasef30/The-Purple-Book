import React, { useMemo, useState } from 'react';
import { DiagramData, DiagramNode, NodeType } from '../types';
import { Server, Shield, Database, Cloud, User, Globe, Laptop, Router, Lock } from 'lucide-react';

interface ArchitectureDiagramProps {
  dataString: string;
}

const LAYER_LABELS = ['External', 'DMZ / Perimeter', 'App Layer', 'Data Layer', 'Mgmt / Core'];

const NODE_ICONS: Record<NodeType, React.ElementType> = {
  firewall: Shield,
  server: Server,
  database: Database,
  user: User,
  cloud: Cloud,
  shield: Lock,
  router: Router,
  endpoint: Laptop
};

const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ dataString }) => {
  const [hoveredNode, setHoveredNode] = useState<DiagramNode | null>(null);

  // Robust parsing of potential AI output quirks
  const diagramData: DiagramData | null = useMemo(() => {
    try {
      // Remove any markdown code block wrapping if present
      const cleanJson = dataString.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse diagram JSON", e);
      return null;
    }
  }, [dataString]);

  if (!diagramData) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400 font-mono bg-red-900/10 border border-red-900 rounded-lg">
        <p>ERROR: UNABLE TO RENDER TOPOLOGY. DATA CORRUPTED.</p>
      </div>
    );
  }

  // Calculate layout columns
  const layers = Array.from({ length: 5 }, (_, i) => 
    diagramData.nodes.filter(n => n.layer === i)
  );

  // Helper to get coordinates for SVG lines
  // We assume a fixed grid based on % for simplicity in this responsive view
  const getPosition = (nodeId: string) => {
    const node = diagramData.nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    
    // X is based on layer (0-4)
    // 5 layers -> 0=10%, 1=30%, 2=50%, 3=70%, 4=90%
    const x = 10 + (node.layer * 20); 
    
    // Y is based on index in that layer
    const layerNodes = diagramData.nodes.filter(n => n.layer === node.layer);
    const index = layerNodes.findIndex(n => n.id === nodeId);
    const count = layerNodes.length;
    // Distribute vertically centered
    const segmentHeight = 100 / count;
    const y = (index * segmentHeight) + (segmentHeight / 2);
    
    return { x, y };
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 backdrop-blur-sm shadow-xl">
        <h3 className="text-xl font-bold text-cyber-blue mb-1 font-mono tracking-tight flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {diagramData.title}
        </h3>
        <p className="text-slate-400 text-sm mb-6 max-w-2xl">{diagramData.description}</p>

        <div className="relative w-full h-[500px] bg-[#050b1a] rounded-lg border border-slate-800 overflow-hidden select-none">
           {/* Grid Background */}
           <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
           
           {/* Column Labels */}
           <div className="absolute top-2 left-0 right-0 flex justify-between px-[5%] text-[10px] text-slate-600 font-mono uppercase tracking-widest pointer-events-none">
             {LAYER_LABELS.map((l, i) => <div key={i} className="text-center w-[20%]">{l}</div>)}
           </div>

           {/* SVG Connections Overlay */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
             <defs>
               <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                 <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" fillOpacity="0.5" />
               </marker>
             </defs>
             {diagramData.connections.map((conn, idx) => {
               const start = getPosition(conn.from);
               const end = getPosition(conn.to);
               return (
                 <g key={idx}>
                   <path 
                     d={`M ${start.x}% ${start.y}% C ${(start.x + end.x)/2}% ${start.y}%, ${(start.x + end.x)/2}% ${end.y}%, ${end.x}% ${end.y}%`}
                     fill="none" 
                     stroke="#3b82f6" 
                     strokeWidth="1.5" 
                     strokeOpacity="0.4"
                     markerEnd="url(#arrowhead)"
                     className="animate-pulse-slow"
                   />
                   {conn.label && (
                     <text 
                        x={`${(start.x + end.x)/2}%`} 
                        y={`${(start.y + end.y)/2}%`} 
                        fill="#94a3b8" 
                        fontSize="10" 
                        textAnchor="middle" 
                        dy="-5"
                        className="bg-slate-900"
                     >
                       {conn.label}
                     </text>
                   )}
                 </g>
               );
             })}
           </svg>

           {/* Nodes Layer */}
           <div className="absolute inset-0 z-10">
             {diagramData.nodes.map((node) => {
               const pos = getPosition(node.id);
               const Icon = NODE_ICONS[node.type] || Server;
               const isHovered = hoveredNode?.id === node.id;

               return (
                 <div
                   key={node.id}
                   className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 ${isHovered ? 'z-20' : 'z-10'}`}
                   style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                   onMouseEnter={() => setHoveredNode(node)}
                   onMouseLeave={() => setHoveredNode(null)}
                 >
                   {/* Node Visual */}
                   <div className={`relative w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-cyber-blue/20 border-cyber-blue scale-125 shadow-[0_0_25px_rgba(59,130,246,0.6)] ring-1 ring-cyber-blue' : 'bg-slate-900 border-slate-700 hover:border-slate-500' } border-2`}>
                      <Icon className={`w-6 h-6 ${isHovered ? 'text-white' : 'text-slate-400'}`} />
                      
                      {/* Status Indicator */}
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-slate-900 animate-pulse"></div>
                   </div>

                   {/* Label */}
                   <div className={`absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-[10px] font-mono tracking-wider transition-colors ${isHovered ? 'text-white border-cyber-blue shadow-lg' : 'text-slate-400'}`}>
                     {node.label}
                   </div>
                 </div>
               );
             })}
           </div>
        </div>
      </div>

      {/* Details Panel */}
      <div className={`transition-all duration-300 overflow-hidden border border-slate-800 rounded-xl bg-slate-900/50 ${hoveredNode ? 'opacity-100 max-h-48' : 'opacity-50 max-h-48 grayscale'}`}>
         <div className="p-4 flex items-start gap-4">
            <div className="w-16 h-16 rounded bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
               {hoveredNode ? (
                  React.createElement(NODE_ICONS[hoveredNode.type], { className: "w-8 h-8 text-cyber-blue" })
               ) : (
                  <ActivityIcon className="w-8 h-8 text-slate-700" />
               )}
            </div>
            <div>
               <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                 {hoveredNode ? hoveredNode.label : 'Select Node for Analysis'}
               </h4>
               <p className="text-sm text-slate-400 leading-relaxed">
                 {hoveredNode ? hoveredNode.details : 'Hover over any component in the network topology to reveal technical specifications, security configurations, and potential attack vectors.'}
               </p>
               {hoveredNode && (
                 <div className="mt-2 flex gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 font-mono">
                      ID: {hoveredNode.id}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                      LAYER: {hoveredNode.layer}
                    </span>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

// Simple placeholder icon
const ActivityIcon = ({className}: {className?: string}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default ArchitectureDiagram;