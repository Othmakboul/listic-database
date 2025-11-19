import React, { useEffect, useRef } from 'react';
import { Point3D } from '../../types';

interface Scatter3DProps {
  data: Point3D[];
  isDarkMode?: boolean;
}

export const Scatter3D: React.FC<Scatter3DProps> = ({ data, isDarkMode = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const rotation = useRef({ x: 0.5, y: 0.5 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

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

    const fov = 250;
    const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

    const render = () => {
      if(!ctx) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;

      const projectedPoints = data.map(point => {
         // Rotate Y
         let tx = point.x * Math.cos(rotation.current.y) - point.z * Math.sin(rotation.current.y);
         let tz = point.x * Math.sin(rotation.current.y) + point.z * Math.cos(rotation.current.y);
         
         // Rotate X
         let ty = point.y;
         let tyNew = ty * Math.cos(rotation.current.x) - tz * Math.sin(rotation.current.x);
         let tzNew = ty * Math.sin(rotation.current.x) + tz * Math.cos(rotation.current.x);
         
         ty = tyNew;
         tz = tzNew;

         const scale = fov / (fov + tz + 400);
         return {
             x: tx * scale + centerX,
             y: ty * scale + centerY,
             scale,
             cluster: point.cluster,
             z: tz
         };
      });

      projectedPoints.sort((a, b) => b.z - a.z);

      projectedPoints.forEach(p => {
        if (p.scale > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(1, 4 * p.scale), 0, Math.PI * 2);
            ctx.fillStyle = colors[p.cluster % colors.length];
            ctx.globalAlpha = Math.min(1, Math.max(0.2, p.scale));
            ctx.fill();
        }
      });
      
      if (!isDragging.current) {
        rotation.current.y += 0.002;
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
    rotation.current.y += deltaX * 0.01;
    rotation.current.x += deltaY * 0.01;
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
      <div className={`absolute bottom-2 left-2 text-[10px] select-none ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        3D View: Drag to rotate
      </div>
    </div>
  );
};