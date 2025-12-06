export enum Category {
  RED = 'RED',
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
  GRC = 'GRC',
  STRATEGY = 'STRATEGY',
  GENERAL = 'GENERAL'
}

export interface Chapter {
  id: string;
  title: string;
  category: Category;
  description: string;
  icon: string;
  promptTopic: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export type ContentType = 'guide' | 'case-study' | 'lab' | 'diagram';

export interface GeneratedContent {
  text: string;
  type: ContentType;
  timestamp: number;
}

// Diagram Specific Types
export type NodeType = 'firewall' | 'server' | 'database' | 'user' | 'cloud' | 'shield' | 'router' | 'endpoint';

export interface DiagramNode {
  id: string;
  label: string;
  type: NodeType;
  details: string; // The content shown on hover
  layer: number; // 0=External, 1=DMZ, 2=Internal, 3=Data
}

export interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
}

export interface DiagramData {
  title: string;
  description: string;
  nodes: DiagramNode[];
  connections: DiagramConnection[];
}