import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  isDarkMode?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '', action, isDarkMode = true }) => {
  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl transition-all duration-500 group hover:shadow-2xl hover:-translate-y-1 ${
      isDarkMode 
        ? 'bg-[#1e293b]/60 border border-white/5 shadow-lg backdrop-blur-md' 
        : 'bg-white/80 border border-slate-200/60 shadow-xl shadow-slate-200/40 backdrop-blur-sm'
    } ${className}`}>
      <div className={`px-6 py-5 border-b flex justify-between items-center transition-colors duration-300 ${
        isDarkMode 
          ? 'border-white/5 bg-white/[0.02]' 
          : 'border-slate-100 bg-slate-50/30'
      }`}>
        <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
          isDarkMode ? 'text-indigo-300/80' : 'text-indigo-600/80'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]' : 'bg-indigo-500'}`}></span>
          {title}
        </h3>
        {action && <div className="opacity-70 group-hover:opacity-100 transition-opacity">{action}</div>}
      </div>
      <div className="p-6 flex-1 relative">
        {children}
      </div>
    </div>
  );
};