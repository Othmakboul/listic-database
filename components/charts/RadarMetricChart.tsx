import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { RadarDataPoint } from '../../types';

interface RadarMetricChartProps {
  data: RadarDataPoint[];
  isDarkMode?: boolean;
}

export const RadarMetricChart: React.FC<RadarMetricChartProps> = ({ data, isDarkMode = true }) => {
  const gridColor = isDarkMode ? "#334155" : "#e2e8f0";
  const textColor = isDarkMode ? "#94a3b8" : "#64748b";
  const tooltipBg = isDarkMode ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDarkMode ? "#334155" : "#e2e8f0";
  const tooltipText = isDarkMode ? "#f1f5f9" : "#1e293b";

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke={gridColor} />
        <PolarAngleAxis dataKey="subject" tick={{ fill: textColor, fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
        <Radar
          name="System A"
          dataKey="A"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.5}
        />
        <Radar
          name="System B"
          dataKey="B"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.3}
        />
        <Tooltip 
            contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '8px' }}
            itemStyle={{ color: isDarkMode ? '#fff' : '#334155' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};