import React from 'react';
import { ArrowRight, Activity, Database, Users, Search } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
  isDarkMode: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter, isDarkMode }) => {
  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Abstract Background Elements */}
      <div className={`absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none`}>
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-20 ${isDarkMode ? 'bg-indigo-500' : 'bg-indigo-300'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-20 ${isDarkMode ? 'bg-purple-500' : 'bg-purple-300'}`}></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Activity size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">LISTIC</span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center">
        <div className="animate-slide-up">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-6 ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-600'}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Live System Monitoring
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight">
            Visualize the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Complexity</span> of Data
          </h1>
          
          <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Advanced analytics platform for real-time user research performance, 
            network topology visualization, and high-dimensional data clustering.
          </p>

          <button 
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95"
          >
            Access Dashboard
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl animate-fade-in delay-200">
          <StatBox 
            icon={<Search />} 
            value="843,202" 
            label="Total Researches" 
            sub="User queries processed"
            isDarkMode={isDarkMode}
          />
          <StatBox 
            icon={<Database />} 
            value="1.2M+" 
            label="Visualizations" 
            sub="Graphs generated in real-time"
            isDarkMode={isDarkMode}
          />
          <StatBox 
            icon={<Users />} 
            value="12,405" 
            label="Active Researchers" 
            sub="Collaborating daily"
            isDarkMode={isDarkMode}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 py-6 text-center text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        © 2023 LISTIC Data Corp. All rights reserved.
      </footer>
    </div>
  );
};

const StatBox: React.FC<{ icon: React.ReactNode; value: string; label: string; sub: string; isDarkMode: boolean }> = ({ icon, value, label, sub, isDarkMode }) => (
  <div className={`p-6 rounded-2xl border transition-all hover:border-indigo-500/50 group ${isDarkMode ? 'bg-slate-900/50 border-slate-800 backdrop-blur-sm' : 'bg-white border-slate-200 shadow-lg shadow-slate-200/50'}`}>
    <div className="flex flex-col items-center text-center">
      <div className={`p-3 rounded-xl mb-4 transition-colors ${isDarkMode ? 'bg-slate-800 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'}`}>
        {icon}
      </div>
      <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        {value}
      </div>
      <div className={`font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {label}
      </div>
      <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
        {sub}
      </div>
    </div>
  </div>
);