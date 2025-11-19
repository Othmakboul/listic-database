import React, { useEffect, useRef } from 'react';
import { HeatPoint3D } from '../../types';

interface AtlasHeatmap3DProps {
  data: HeatPoint3D[];
  isDarkMode?: boolean;
}

export const AtlasHeatmap3D: React.FC<AtlasHeatmap3DProps> = ({ data, isDarkMode = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const rotation = useRef({ x: 0.8, y: 0.6 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    
    const handleResize = () => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = container.clientWidth * dpr;
        canvas.height = container.clientHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${container.clientWidth}px`;
        canvas.style.height = `${container.clientHeight}px`;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    const gridSize = 41; 
    const fov = 400;

    const render = () => {
      if(!ctx) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      timeRef.current += 0.02; 

      const projectedPoints = data.map((point, i) => {
         // Animate Height
         const wave = Math.sin(point.x * 0.1 + timeRef.current) * Math.cos(point.z * 0.1 + timeRef.current) * 10;
         const yRaw = point.y + wave;

         // Rotate Y
         let tx = point.x * Math.cos(rotation.current.y) - point.z * Math.sin(rotation.current.y);
         let tz = point.x * Math.sin(rotation.current.y) + point.z * Math.cos(rotation.current.y);
         let ty = yRaw;
         
         // Rotate X
         let tyNew = ty * Math.cos(rotation.current.x) - tz * Math.sin(rotation.current.x);
         let tzNew = ty * Math.sin(rotation.current.x) + tz * Math.cos(rotation.current.x);
         
         ty = tyNew;
         tz = tzNew;

         const scale = fov / (fov + tz + 600);
         
         return {
             x: tx * scale + centerX,
             y: ty * scale + centerY,
             scale: scale,
             z: tz,
             value: yRaw
         };
      });

      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < projectedPoints.length; i++) {
        const p = projectedPoints[i];
        if (p.scale < 0) continue; 

        const zIndex = i % gridSize; 
        const xIndex = Math.floor(i / gridSize); 

        const normalized = Math.max(0, Math.min(1, (p.value + 50) / 100));
        const hue = 220 - (normalized * 200); 
        const alpha = Math.min(1, Math.max(0.1, p.scale));
        
        const color = isDarkMode 
            ? `hsla(${hue}, 90%, 60%, ${alpha})`
            : `hsla(${hue}, 80%, 40%, ${alpha})`;

        ctx.strokeStyle = color;
        ctx.beginPath();

        // Connect Right
        if (zIndex < gridSize - 1) {
           const right = projectedPoints[i + 1];
           if (right.scale > 0) {
               ctx.moveTo(p.x, p.y);
               ctx.lineTo(right.x, right.y);
           }
        }
        
        // Connect Bottom
        if (xIndex < gridSize - 1) {
           const bottom = projectedPoints[i + gridSize];
           if (bottom && bottom.scale > 0) {
               ctx.moveTo(p.x, p.y);
               ctx.lineTo(bottom.x, bottom.y);
           }
        }
        ctx.stroke();
      }
      
      if (!isDragging.current) {
        rotation.current.y += 0.001;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [data, isDarkMode]);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;
    rotation.current.y += deltaX * 0.005;
    rotation.current.x += deltaY * 0.005;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div 
        ref={containerRef} 
        className="w-full h-full cursor-move relative group"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      <div className={`absolute bottom-6 right-6 px-4 py-3 rounded-xl border backdrop-blur-xl transition-colors duration-500 ${
          isDarkMode ? 'bg-[#0f172a]/80 border-white/10 shadow-2xl' : 'bg-white/80 border-slate-200 shadow-xl'
      }`}>
         <div className={`text-[10px] font-bold mb-2 uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Topography Delta</div>
         <div className="flex items-center gap-3 text-[10px] font-medium">
            <span className="text-blue-500">Low</span>
            <div className="w-32 h-1.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500"></div>
            <span className="text-orange-500">High</span>
         </div>
      </div>

      <div className={`absolute top-4 left-4 text-[10px] tracking-widest font-mono select-none transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        ATLAS II // SPATIAL ENGINE
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`px-4 py-2 rounded-full backdrop-blur-md text-xs font-medium ${isDarkMode ? 'bg-black/50 text-white' : 'bg-white/50 text-slate-800'}`}>
              Drag to Rotate
          </div>
      </div>
    </div>
  );
};