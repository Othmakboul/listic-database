import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

export enum ChartType {
  AREA = 'AREA',
  BAR = 'BAR',
  PIE = 'PIE',
  NETWORK = 'NETWORK',
  SCATTER_3D = 'SCATTER_3D',
  RADAR = 'RADAR',
  ATLAS_3D = 'ATLAS_3D'
}

export interface DataPoint {
  name: string;
  value: number;
  category?: string;
  [key: string]: any;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
  cluster: number;
  id: string;
}

export interface HeatPoint3D {
  x: number;
  y: number;
  z: number;
  value: number;
}

// Fixed: Explicitly added D3 simulation properties (x, y, fx, fy, etc.) to NetworkNode
// to resolve errors where these properties were considered missing.
export interface NetworkNode extends SimulationNodeDatum {
  id: string;
  group: number;
  val: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface NetworkLink extends SimulationLinkDatum<NetworkNode> {
  source: string | NetworkNode;
  target: string | NetworkNode;
  value: number;
  label?: string;
}

export interface GraphData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export interface InsightRequest {
  context: string;
  dataSample: any;
}

export interface RadarDataPoint {
  subject: string;
  A: number;
  B: number;
  fullMark: number;
}