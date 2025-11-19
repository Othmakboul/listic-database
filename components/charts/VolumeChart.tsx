import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataPoint } from '../../types';

interface VolumeChartProps {
  data: DataPoint[];
  isDarkMode?: boolean;
}

export const VolumeChart: React.FC<VolumeChartProps> = ({ data, isDarkMode = true }) => {
  // Theme Constants
  const gridColor = isDarkMode ? "#334155" : "#e2e8f0";
  const axisTextColor = isDarkMode ? "#94a3b8" : "#64748b";
  const tooltipBg = isDarkMode ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDarkMode ? "#334155" : "#e2e8f0";
  const tooltipText = isDarkMode ? "#f1f5f9" : "#1e293b";

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="name" stroke={axisTextColor} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke={axisTextColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: tooltipBg, 
            borderColor: tooltipBorder, 
            color: tooltipText,
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
          }}
          itemStyle={{ color: '#818cf8' }}
        />
        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};