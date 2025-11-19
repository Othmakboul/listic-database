import React, { useEffect, useRef } from 'react';
import { ArrowRight, Activity, Database, Users, Search, BarChart3, Share2, PieChart, BookOpen, Globe } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
  isDarkMode: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter, isDarkMode }) => {
  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500 font-sans ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. Interactive Canvas Background */}
      <BackgroundCanvas isDarkMode={isDarkMode} />

      {/* 2. Floating Background Widgets (Visualizations) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top Left - Bar Chart */}
        <FloatingWidget 
           className="top-[15%] left-[5%] md:left-[10%] animation-float-slow"
           isDarkMode={isDarkMode}
           rotate="-6deg"
        >
           <div className="flex items-end gap-1 h-16 w-24">
              <div className="w-full bg-indigo-500/80 rounded-t-sm h-[40%] animate-pulse"></div>
              <div className="w-full bg-indigo-400/80 rounded-t-sm h-[70%] animate-pulse delay-75"></div>
              <div className="w-full bg-purple-500/80 rounded-t-sm h-[50%] animate-pulse delay-150"></div>
              <div className="w-full bg-indigo-600/80 rounded-t-sm h-[85%] animate-pulse delay-100"></div>
              <div className="w-full bg-violet-500/80 rounded-t-sm h-[60%] animate-pulse delay-200"></div>
           </div>
        </FloatingWidget>

        {/* Bottom Right - Wave Graph */}
        <FloatingWidget 
           className="bottom-[20%] right-[5%] md:right-[10%] animation-float-medium"
           isDarkMode={isDarkMode}
           rotate="6deg"
        >
           <div className="h-16 w-32 flex items-center justify-center">
              <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                 <path d="M0 20 Q 12 5, 25 20 T 50 20 T 75 20 T 100 20" 
                       fill="none" 
                       stroke={isDarkMode ? "#818cf8" : "#6366f1"} 
                       strokeWidth="3" 
                       className="animate-dash"
                 />
              </svg>
           </div>
        </FloatingWidget>

        {/* Top Right - Network Node */}
        <FloatingWidget 
           className="top-[20%] right-[15%] animation-float-fast hidden md:block"
           isDarkMode={isDarkMode}
           rotate="12deg"
        >
           <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-dashed border-indigo-500/30 rounded-full animate-spin-slow"></div>
              <Share2 className="text-indigo-500 opacity-80" size={32} />
              <div className="absolute top-0 right-0 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
           </div>
        </FloatingWidget>
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex justify-between items-center px-6 md:px-10 py-6 max-w-7xl mx-auto w-full backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Activity size={22} className="text-white" />
          </div>
          <span className={`font-bold text-2xl tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>LISTIC</span>
        </div>
        <div className={`hidden md:block text-xs font-medium uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Université Savoie Mont Blanc
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center mt-[-40px]">
        <div className="animate-slide-up max-w-5xl mx-auto">
          
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border mb-8 backdrop-blur-md shadow-sm transition-colors ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-white/60 border-indigo-200 text-indigo-600'}`}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            USMB Research Laboratory Unit (EA3703)
          </div>
          
          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Visualizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">Scientific Impact</span>
            <br />
            <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>at LISTIC</span>
          </h1>
          
          {/* Subtitle */}
          <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-light ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Explore the performance, publications, and networks of over <strong className="font-semibold text-indigo-400">250+ researchers</strong> at Université Savoie Mont Blanc. 
            Analyzing advances in Machine Learning, Information Fusion, and Earth Observation.
          </p>

          {/* CTA Button */}
          <button 
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full hover:shadow-lg hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2 text-lg">
              Explore Dashboard
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Button Glow */}
            <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl animate-fade-in delay-300">
           <GlassStat 
              icon={<Users size={18} />} 
              label="Active Researchers" 
              value="250+" 
              isDarkMode={isDarkMode} 
           />
           <GlassStat 
              icon={<BookOpen size={18} />} 
              label="Annual Publications" 
              value="120+" 
              isDarkMode={isDarkMode} 
           />
           <GlassStat 
              icon={<Globe size={18} />} 
              label="Research Themes" 
              value="4" 
              isDarkMode={isDarkMode} 
           />
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 py-8 text-center text-xs font-medium tracking-wide uppercase opacity-60 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        Polytech Annecy-Chambéry • Université Savoie Mont Blanc
      </footer>
      
      {/* Global Styles for Custom Animations */}
      <style>{`
        .animation-float-slow { animation: float 8s ease-in-out infinite; }
        .animation-float-medium { animation: float 6s ease-in-out infinite; }
        .animation-float-fast { animation: float 5s ease-in-out infinite; }
        @keyframes float {
          0% { transform: translateY(0px) rotate(var(--tw-rotate)); }
          50% { transform: translateY(-20px) rotate(var(--tw-rotate)); }
          100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        .animate-dash {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: dash 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

// --- Helper Components ---

const FloatingWidget: React.FC<{ children: React.ReactNode, className?: string, isDarkMode: boolean, rotate?: string }> = ({ children, className, isDarkMode, rotate = '0deg' }) => (
  <div 
    className={`absolute p-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-colors ${
       isDarkMode 
         ? 'bg-[#1e293b]/40 border-indigo-500/20 shadow-indigo-900/20' 
         : 'bg-white/40 border-indigo-200/50 shadow-indigo-200/30'
    } ${className}`}
    style={{ transform: `rotate(${rotate})`, '--tw-rotate': rotate } as React.CSSProperties}
  >
     <div className="opacity-90">{children}</div>
  </div>
);

const GlassStat: React.FC<{ icon: React.ReactNode, label: string, value: string, isDarkMode: boolean }> = ({ icon, label, value, isDarkMode }) => (
  <div className={`px-6 py-4 rounded-xl flex items-center gap-4 border transition-all duration-300 hover:-translate-y-1 ${
     isDarkMode 
       ? 'bg-slate-900/40 border-slate-800/60 backdrop-blur-sm hover:bg-slate-800/60' 
       : 'bg-white/60 border-slate-200/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-lg'
  }`}>
     <div className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
        {icon}
     </div>
     <div className="text-left">
        <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</div>
        <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{label}</div>
     </div>
  </div>
);

// --- Background Canvas Component ---
const BackgroundCanvas: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{x: number, y: number, vx: number, vy: number, size: number}> = [];
    
    const init = () => {
       const width = window.innerWidth;
       const height = window.innerHeight;
       const dpr = window.devicePixelRatio || 1;
       
       canvas.width = width * dpr;
       canvas.height = height * dpr;
       ctx.scale(dpr, dpr);
       canvas.style.width = `${width}px`;
       canvas.style.height = `${height}px`;

       // Create particles
       const particleCount = Math.floor((width * height) / 15000);
       particles = [];
       for(let i=0; i<particleCount; i++) {
          particles.push({
             x: Math.random() * width,
             y: Math.random() * height,
             vx: (Math.random() - 0.5) * 0.5,
             vy: (Math.random() - 0.5) * 0.5,
             size: Math.random() * 2
          });
       }
    };

    const render = () => {
       if (!ctx) return;
       const width = canvas.width / (window.devicePixelRatio || 1);
       const height = canvas.height / (window.devicePixelRatio || 1);

       ctx.clearRect(0, 0, width, height);

       // Colors
       const particleColor = isDarkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(79, 70, 229, 0.4)'; // Indigo
       const lineColor = isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)';

       // Update and Draw Particles
       particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;

          // Bounce
          if(p.x < 0 || p.x > width) p.vx *= -1;
          if(p.y < 0 || p.y > height) p.vy *= -1;

          // Draw Particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = particleColor;
          ctx.fill();

          // Connect to nearby
          for(let j=i+1; j<particles.length; j++) {
             const p2 = particles[j];
             const dx = p.x - p2.x;
             const dy = p.y - p2.y;
             const dist = Math.sqrt(dx*dx + dy*dy);

             if(dist < 150) {
                ctx.beginPath();
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 1 - (dist / 150);
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
             }
          }
       });
       
       animationId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', init);
    init();
    render();

    return () => {
       window.removeEventListener('resize', init);
       cancelAnimationFrame(animationId);
    };
  }, [isDarkMode]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};