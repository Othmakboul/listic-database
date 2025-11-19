import React, { useState, useEffect } from 'react';
import { Activity, BarChart3, PieChart, Share2, Menu, Bell, User, RefreshCw, Box, Hexagon, Sun, Moon, Map } from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { VolumeChart } from './components/charts/VolumeChart';
import { DistributionChart } from './components/charts/DistributionChart';
import { NetworkVisualizer } from './components/charts/NetworkVisualizer';
import { Scatter3D } from './components/charts/Scatter3D';
import { RadarMetricChart } from './components/charts/RadarMetricChart';
import { AtlasHeatmap3D } from './components/charts/AtlasHeatmap3D';
import { LandingPage } from './components/LandingPage';
import { GraphData, Point3D, RadarDataPoint, HeatPoint3D } from './types';

// --- Mock Data ---
const VOLUME_DATA = Array.from({ length: 12 }, (_, i) => ({
  name: `T-${i * 5}s`,
  value: Math.floor(Math.random() * 5000) + 2000,
  uv: Math.floor(Math.random() * 3000) + 1000,
}));

const DISTRIBUTION_DATA = [
  { name: 'Cluster Alpha', value: 400 },
  { name: 'Cluster Beta', value: 300 },
  { name: 'Cluster Gamma', value: 300 },
  { name: 'Cluster Delta', value: 200 },
  { name: 'Cluster Epsilon', value: 150 },
];

const PROTOCOLS = ['TCP', 'UDP', 'HTTP/3', 'GRPC', 'WS'];

const NETWORK_DATA: GraphData = {
  nodes: Array.from({ length: 25 }, (_, i) => ({ id: `Node-${i}`, group: Math.floor(Math.random() * 5), val: Math.random() * 10 })),
  links: Array.from({ length: 45 }, () => {
    const latency = Math.floor(Math.random() * 150);
    const protocol = PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)];
    return {
      source: `Node-${Math.floor(Math.random() * 25)}`,
      target: `Node-${Math.floor(Math.random() * 25)}`,
      value: Math.random() * 5,
      label: `${protocol} • ${latency}ms`
    };
  })
};

const SCATTER_DATA: Point3D[] = Array.from({ length: 200 }, (_, i) => ({
  id: `P-${i}`,
  x: (Math.random() - 0.5) * 400,
  y: (Math.random() - 0.5) * 400,
  z: (Math.random() - 0.5) * 400,
  cluster: Math.floor(Math.random() * 5)
}));

// Generate Atlas Heatmap Data (Terrain-like wave)
const ATLAS_DATA: HeatPoint3D[] = [];
const gridSize = 20; // Range -20 to 20 => 41 points width
const spacing = 20;

for (let x = -gridSize; x <= gridSize; x++) {
  for (let z = -gridSize; z <= gridSize; z++) {
    // Create a complex wave function for terrain-like data
    const dist = Math.sqrt(x*x + z*z);
    const y1 = Math.sin(dist * 0.4) * 35;
    const y2 = Math.cos(x * 0.3) * Math.sin(z * 0.3) * 25;
    const y = y1 + y2; // Height value
    
    ATLAS_DATA.push({
      x: x * spacing,
      y: y, 
      z: z * spacing,
      value: y
    });
  }
}

const RADAR_DATA: RadarDataPoint[] = [
  { subject: 'Processing', A: 120, B: 110, fullMark: 150 },
  { subject: 'Memory', A: 98, B: 130, fullMark: 150 },
  { subject: 'I/O Rate', A: 86, B: 130, fullMark: 150 },
  { subject: 'Uplink', A: 99, B: 100, fullMark: 150 },
  { subject: 'Cache Hit', A: 85, B: 90, fullMark: 150 },
  { subject: 'Stability', A: 65, B: 85, fullMark: 150 },
];

// --- Main Component ---

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'network' | 'analytics' | '3d' | 'atlas'>('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedContext, setSelectedContext] = useState<string>("");
  
  // Apply Dark Mode Class to Body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a'; // Deep Slate
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc'; // Slate 50
    }
  }, [isDarkMode]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSelectedContext("");
  }, [activeTab]);

  const handleSelection = (type: string, data: any) => {
    setSelectedContext(`Selected ${type}: ${data.id || data.name}`);
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 font-sans ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar */}
      <aside className={`w-20 lg:w-72 border-r flex flex-col hidden md:flex z-30 transition-all duration-300 ${
          isDarkMode ? 'bg-[#0f172a] border-slate-800/60' : 'bg-white border-slate-200'
        }`}>
        <button 
          onClick={() => setShowLanding(true)}
          className={`h-20 flex w-full items-center justify-center lg:justify-start lg:px-8 transition-colors group ${
             isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
          }`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center mr-0 lg:mr-4 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
            <Activity size={22} className="text-white" />
          </div>
          <div className="hidden lg:block">
            <span className={`font-bold text-xl tracking-tight block ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>LISTIC</span>
            <span className={`text-[10px] font-medium tracking-widest uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Visualizer Pro</span>
          </div>
        </button>

        <nav className="flex-1 py-8 space-y-1 px-4">
          <div className={`text-[10px] font-bold uppercase tracking-widest mb-4 px-4 hidden lg:block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
             Main Module
          </div>
          <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label="Dashboard" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
            isDarkMode={isDarkMode}
          />
          <SidebarItem 
            icon={<Share2 size={20} />} 
            label="Network Topology" 
            active={activeTab === 'network'} 
            onClick={() => setActiveTab('network')} 
            isDarkMode={isDarkMode}
          />
          <SidebarItem 
            icon={<PieChart size={20} />} 
            label="Data Analytics" 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')} 
            isDarkMode={isDarkMode}
          />
          
          <div className={`mt-8 mb-4 px-4 text-[10px] font-bold uppercase tracking-widest hidden lg:block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Spatial Engine
          </div>
          <SidebarItem 
            icon={<Box size={20} />} 
            label="3D Point Cloud" 
            active={activeTab === '3d'} 
            onClick={() => setActiveTab('3d')} 
            isDarkMode={isDarkMode}
          />
          <SidebarItem 
            icon={<Map size={20} />} 
            label="Atlas II Heatmap" 
            active={activeTab === 'atlas'} 
            onClick={() => setActiveTab('atlas')} 
            isDarkMode={isDarkMode}
          />
        </nav>

        <div className="p-6">
           <div className={`rounded-2xl p-5 border backdrop-blur-sm ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-100/80 border-slate-200 text-slate-600'
           }`}>
             <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase">System Health</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
             </div>
             <div className={`w-full h-1.5 rounded-full overflow-hidden mb-3 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}>
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[92%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
             </div>
             <div className="flex justify-between text-[10px] font-mono opacity-80">
                <span>CPU: 12%</span>
                <span>MEM: 3.4GB</span>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Decorative Glow */}
        {isDarkMode && (
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        )}
        
        {/* Header */}
        <header className={`h-20 flex items-center justify-between px-8 relative z-20 transition-colors ${
          isDarkMode ? 'bg-[#0f172a]/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'
        }`}>
          <div className="flex items-center gap-4 md:hidden">
            <Menu className={isDarkMode ? 'text-slate-400' : 'text-slate-600'} />
            <button onClick={() => setShowLanding(true)} className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>LISTIC</button>
          </div>
          
          <div className="hidden md:flex flex-col">
             <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
               {activeTab === 'overview' && 'Overview'}
               {activeTab === 'network' && 'Network Map'}
               {activeTab === 'analytics' && 'Analytics'}
               {activeTab === '3d' && '3D Lab'}
               {activeTab === 'atlas' && 'Atlas II'}
             </h2>
             <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Real-time Session ID: #8X-9921</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`hidden md:block text-xs font-mono px-3 py-1 rounded-full border ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                isDarkMode 
                ? 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10' 
                : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className={`p-2.5 rounded-full transition-all duration-300 relative ${
               isDarkMode 
               ? 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10' 
               : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
            }`}>
              <Bell size={18} />
              <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            </button>
            
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-2 ring-offset-2 ring-transparent ring-offset-transparent hover:ring-indigo-500/30 transition-all cursor-pointer">
              <User size={18} className="text-white" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full space-y-8 pb-10">
            
            {/* Dynamic Context Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 animate-fade-in">
              <div>
                 <div className={`text-sm font-medium mb-1 flex items-center gap-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                   <Activity size={14} /> Live Monitoring
                 </div>
                 <h1 className={`text-3xl md:text-4xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                   System Performance
                 </h1>
              </div>
              
              {selectedContext && (
                 <div className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 animate-slide-up ${
                   isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                 }`}>
                   <span>{selectedContext}</span>
                   <button onClick={() => setSelectedContext("")} className="ml-2 hover:text-white"><RefreshCw size={12}/></button>
                 </div>
              )}
            </div>

            {/* --- TABS CONTENT --- */}

            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
                <DashboardCard title="Global Traffic Volume" className="lg:col-span-2 h-[28rem]" isDarkMode={isDarkMode}>
                  <VolumeChart data={VOLUME_DATA} isDarkMode={isDarkMode} />
                </DashboardCard>
                
                <DashboardCard title="Cluster Distribution" className="h-[28rem]" isDarkMode={isDarkMode}>
                  <DistributionChart 
                    data={DISTRIBUTION_DATA} 
                    onSelect={(item) => handleSelection('Cluster', item)}
                    isDarkMode={isDarkMode} 
                  />
                </DashboardCard>

                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard 
                     label="Total Throughput" value="142.5 TB" trend="+12.5%" trendUp={true} 
                     icon={<Activity size={18}/>} isDarkMode={isDarkMode} 
                  />
                  <StatCard 
                     label="Active Connections" value="8,291" trend="+4.1%" trendUp={true} 
                     icon={<Share2 size={18}/>} isDarkMode={isDarkMode} 
                  />
                  <StatCard 
                     label="System Latency" value="14ms" trend="-2ms" trendUp={true} 
                     icon={<Hexagon size={18}/>} isDarkMode={isDarkMode} 
                  />
                </div>
              </div>
            )}

            {activeTab === 'network' && (
              <div className="h-[calc(100vh-240px)] min-h-[600px] animate-slide-up">
                <DashboardCard 
                  title="Network Topology Map" 
                  className="h-full"
                  isDarkMode={isDarkMode}
                  action={<span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}>Live Force-Directed</span>}
                >
                  <NetworkVisualizer 
                    data={NETWORK_DATA} 
                    onNodeSelect={(node) => handleSelection('Node', node)}
                    isDarkMode={isDarkMode}
                  />
                </DashboardCard>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
                <DashboardCard title="System Metrics Radar" className="h-[26rem]" isDarkMode={isDarkMode}>
                   <RadarMetricChart data={RADAR_DATA} isDarkMode={isDarkMode} />
                </DashboardCard>
                <DashboardCard title="User Segmentation" className="h-[26rem]" isDarkMode={isDarkMode}>
                   <DistributionChart 
                      data={DISTRIBUTION_DATA}
                      onSelect={(item) => handleSelection('Segment', item)}
                      isDarkMode={isDarkMode} 
                   />
                </DashboardCard>
                <DashboardCard title="Predictive Traffic Model" className="md:col-span-2 h-80" isDarkMode={isDarkMode}>
                   <VolumeChart data={VOLUME_DATA.map(d => ({...d, value: d.value * 1.2 + 1000}))} isDarkMode={isDarkMode} />
                </DashboardCard>
              </div>
            )}

            {activeTab === '3d' && (
               <div className="h-[calc(100vh-240px)] min-h-[600px] animate-slide-up">
                 <DashboardCard title="3D Data Cluster Analysis" className="h-full" isDarkMode={isDarkMode}>
                   <Scatter3D data={SCATTER_DATA} isDarkMode={isDarkMode} />
                 </DashboardCard>
               </div>
            )}

            {activeTab === 'atlas' && (
               <div className="h-[calc(100vh-240px)] min-h-[600px] animate-slide-up">
                 <DashboardCard 
                   title="Atlas II Spatial Engine" 
                   className="h-full" 
                   isDarkMode={isDarkMode}
                   action={<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span><span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Live Terrain Mesh</span></div>}
                 >
                   <AtlasHeatmap3D data={ATLAS_DATA} isDarkMode={isDarkMode} />
                 </DashboardCard>
               </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

// --- Styled Components ---

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; isDarkMode: boolean }> = ({ icon, label, active, onClick, isDarkMode }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
      active 
      ? (isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600')
      : (isDarkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900')
    }`}
  >
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
    )}
    <span className="z-10 relative group-hover:scale-110 transition-transform duration-200">{icon}</span>
    <span className={`font-medium text-sm hidden lg:block z-10 ${active ? 'font-semibold' : ''}`}>{label}</span>
  </button>
);

const StatCard: React.FC<{ label: string; value: string; trend: string; trendUp: boolean; icon?: React.ReactNode; isDarkMode: boolean }> = ({ label, value, trend, trendUp, icon, isDarkMode }) => (
  <div className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group ${
    isDarkMode 
      ? 'bg-[#1e293b]/60 border border-white/5 shadow-lg backdrop-blur-md hover:bg-slate-800/80' 
      : 'bg-white border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-xl'
  }`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
      <div className={`p-2 rounded-lg transition-colors ${
        isDarkMode 
        ? 'bg-slate-800 text-indigo-400 group-hover:text-white group-hover:bg-indigo-600' 
        : 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white'
      }`}>
        {icon}
      </div>
    </div>
    <div className="flex items-baseline gap-3">
      <span className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{value}</span>
      <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center ${
        trendUp 
        ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
        : (isDarkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600')
      }`}>
        {trend}
      </span>
    </div>
  </div>
);

export default App;