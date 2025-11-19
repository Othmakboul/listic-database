import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { RotateCcw } from 'lucide-react';
import { GraphData, NetworkNode, NetworkLink } from '../../types';

interface NetworkVisualizerProps {
  data: GraphData;
  onNodeSelect?: (node: NetworkNode | null) => void;
  isDarkMode?: boolean;
}

export const NetworkVisualizer: React.FC<NetworkVisualizerProps> = ({ data, onNodeSelect, isDarkMode = true }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeLinkIndex, setActiveLinkIndex] = useState<number | null>(null);
  const [resetKey, setResetKey] = useState(0);

  // Theme Colors - Clean and High Contrast
  const linkColor = isDarkMode ? "#6366f1" : "#94a3b8"; // Indigo vs Slate
  const nodeStroke = isDarkMode ? "#0f172a" : "#ffffff";
  const textColor = isDarkMode ? "#e2e8f0" : "#1e293b";

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResetKey(prev => prev + 1);
    setActiveLinkIndex(null);
    if (onNodeSelect) onNodeSelect(null);
  };

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("font-family", "'Inter', sans-serif")
      .on("click", () => {
         setActiveLinkIndex(null);
         if (onNodeSelect) onNodeSelect(null);
      });

    // Container for Zoom
    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Data Deep Copy to prevent mutation of props
    const nodes = data.nodes.map(d => ({ ...d }));
    const links = data.links.map(d => ({ ...d }));

    // --- Physics Simulation (Optimized for Stability) ---
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100).strength(0.3)) // Weaker strength for smoother layout
      .force("charge", d3.forceManyBody().strength(-400).distanceMax(500)) // Strong repulsion, limited range
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.1)) // Gentle centering
      .force("collide", d3.forceCollide(25).strength(0.7).iterations(1)); // Prevent overlap efficiently

    // --- Render Elements ---

    // 1. Invisible Link Hit Areas (Wider lines for easier clicking)
    const linkHitArea = g.append("g")
      .attr("class", "link-hit-areas")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "transparent")
      .attr("stroke-width", 20)
      .style("cursor", "pointer")
      .on("click", (event, d: any) => {
        event.stopPropagation();
        setActiveLinkIndex(prev => prev === d.index ? null : d.index);
      });

    // 2. Visible Links (Optimized: No filters, just opacity)
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", linkColor)
      .attr("stroke-opacity", isDarkMode ? 0.3 : 0.4) 
      .attr("stroke-width", d => Math.max(1.5, Math.sqrt(d.value)))
      .style("transition", "stroke-opacity 0.3s ease, stroke 0.3s ease");

    // 3. Link Labels (Hidden by default, pills)
    const linkLabels = g.append("g")
      .attr("class", "link-labels")
      .selectAll("g") // Group for text + background
      .data(links)
      .join("g")
      .style("opacity", 0)
      .style("pointer-events", "none");
      
    // Label Background (Pill shape)
    linkLabels.append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("x", -20)
        .attr("y", -10)
        .attr("width", 40)
        .attr("height", 20)
        .attr("fill", isDarkMode ? "#1e293b" : "#ffffff")
        .attr("stroke", isDarkMode ? "#6366f1" : "#cbd5e1")
        .attr("stroke-width", 1)
        .attr("fill-opacity", 0.95);

    // Label Text
    linkLabels.append("text")
      .text(d => d.label || "Link")
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("font-size", 10)
      .attr("font-weight", "600")
      .attr("fill", isDarkMode ? "#cbd5e1" : "#475569");

    // Resize pill background to fit text
    linkLabels.each(function(d) {
        const gEl = d3.select(this);
        const textEl = gEl.select("text");
        const bbox = (textEl.node() as SVGTextElement).getBBox();
        gEl.select("rect")
           .attr("x", bbox.x - 6)
           .attr("y", bbox.y - 2)
           .attr("width", bbox.width + 12)
           .attr("height", bbox.height + 4);
    });

    // 4. Nodes (Simplified: Circle + Border)
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, NetworkNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Outer Ring (Halo)
    node.append("circle")
      .attr("r", d => 8 + (d.val || 0))
      .attr("fill", d => getNodeColor(d.group))
      .attr("fill-opacity", 0.15)
      .attr("stroke", "none");

    // Inner Core
    node.append("circle")
      .attr("r", d => 5 + (d.val || 0) * 0.5)
      .attr("fill", d => getNodeColor(d.group))
      .attr("stroke", nodeStroke)
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    // Interactions
    node.on('mouseover', function(event, d) {
       // Highlight Neighbors Logic
       const connectedNodeIds = new Set<string>();
       connectedNodeIds.add(d.id);
       links.forEach(l => {
           const source = l.source as NetworkNode;
           const target = l.target as NetworkNode;
           if(source.id === d.id) connectedNodeIds.add(target.id);
           if(target.id === d.id) connectedNodeIds.add(source.id);
       });

       // Fade others
       node.transition().duration(200).style('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.15);
       text.transition().duration(200).style('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.15);
       
       // Highlight specific links
       link.transition().duration(200)
           .style('stroke-opacity', l => {
             const source = l.source as NetworkNode;
             const target = l.target as NetworkNode;
             return (source.id === d.id || target.id === d.id) ? 1 : 0.05;
           })
           .attr('stroke', l => {
             const source = l.source as NetworkNode;
             const target = l.target as NetworkNode;
             return (source.id === d.id || target.id === d.id) ? getNodeColor(d.group) : linkColor;
           });
           
       // Scale up active node
       d3.select(this).selectAll("circle").transition().duration(200).attr("transform", "scale(1.15)");
    })
    .on('mouseout', function() {
       // Reset all
       node.transition().duration(200).style('opacity', 1);
       text.transition().duration(200).style('opacity', 0.8);
       link.transition().duration(200).style('stroke-opacity', isDarkMode ? 0.3 : 0.4).attr('stroke', linkColor);
       d3.select(this).selectAll("circle").transition().duration(200).attr("transform", "scale(1)");
    })
    .on('click', (event, d) => {
      event.stopPropagation();
      if(onNodeSelect) onNodeSelect(d);
    });

    // 5. Node Labels
    const text = g.append("g")
        .attr("class", "node-labels")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("dx", 14)
        .attr("dy", ".35em")
        .text(d => d.id)
        .style("fill", textColor)
        .style("font-weight", "500")
        .style("font-size", "10px")
        .style("pointer-events", "none")
        .style("opacity", 0.8)
        .style("text-shadow", isDarkMode ? "0 1px 2px rgba(0,0,0,0.8)" : "0 1px 2px rgba(255,255,255,0.8)");

    // --- Simulation Tick ---
    simulation.on("tick", () => {
      linkHitArea
        .attr("x1", d => (d.source as NetworkNode).x!)
        .attr("y1", d => (d.source as NetworkNode).y!)
        .attr("x2", d => (d.target as NetworkNode).x!)
        .attr("y2", d => (d.target as NetworkNode).y!);

      link
        .attr("x1", d => (d.source as NetworkNode).x!)
        .attr("y1", d => (d.source as NetworkNode).y!)
        .attr("x2", d => (d.target as NetworkNode).x!)
        .attr("y2", d => (d.target as NetworkNode).y!);

      linkLabels
        .attr("transform", d => {
            const x = ((d.source as NetworkNode).x! + (d.target as NetworkNode).x!) / 2;
            const y = ((d.source as NetworkNode).y! + (d.target as NetworkNode).y!) / 2;
            return `translate(${x}, ${y})`;
        });

      node.attr("transform", d => `translate(${d.x},${d.y})`);
      text.attr("x", d => d.x!).attr("y", d => d.y!);
    });

    // Helper: Colors
    function getNodeColor(group: number) {
        const colors = isDarkMode 
            ? ["#ef4444", "#6366f1", "#10b981", "#f59e0b", "#ec4899"] 
            : ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
        return colors[group % colors.length];
    }

    // Drag Behaviors
    function dragstarted(event: any, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: NetworkNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, resetKey, isDarkMode]); 

  // Handle Label Visibility separately
  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current)
      .selectAll(".link-labels g")
      .transition()
      .duration(200)
      .style("opacity", (d: any) => d.index === activeLinkIndex ? 1 : 0);
  }, [activeLinkIndex]);

  return (
    <div className={`w-full h-full relative group rounded-xl overflow-hidden ${isDarkMode ? 'bg-[#0b1121]' : 'bg-slate-50/50'}`}>
      {/* Clean Grid Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ 
             backgroundImage: `radial-gradient(${isDarkMode ? '#fff' : '#000'} 1px, transparent 1px)`, 
             backgroundSize: '24px 24px' 
           }}>
      </div>

      <svg ref={svgRef} className="w-full h-full z-10 relative" />
      
      <button 
        onClick={handleReset}
        className={`absolute top-4 right-4 p-2 rounded-lg border backdrop-blur-md transition-all shadow-lg z-20 active:scale-95 ${
           isDarkMode 
           ? 'bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white border-slate-700' 
           : 'bg-white/90 hover:bg-indigo-500 text-slate-600 hover:text-white border-slate-200'
        }`}
        title="Reset Layout"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
};