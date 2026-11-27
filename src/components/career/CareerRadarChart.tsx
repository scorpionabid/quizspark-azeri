import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import { CareerRadarPoint } from '@/types/career';

interface CareerRadarChartProps {
  data: CareerRadarPoint[];
}

export const CareerRadarChart: React.FC<CareerRadarChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[320px] sm:h-[380px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="currentColor" className="text-muted/40" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 500 }}
            className="text-foreground"
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: 'currentColor', fontSize: 10 }}
            className="text-muted-foreground"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as CareerRadarPoint;
                return (
                  <div className="bg-popover/95 border text-popover-foreground text-xs p-2.5 rounded-xl shadow-lg backdrop-blur-sm">
                    <p className="font-semibold text-sm mb-1">{item.subject}</p>
                    <p className="text-primary font-bold">Uyğunluq: {item.score}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Radar
            name="Potensial"
            dataKey="score"
            stroke="#6366f1"
            fill="#818cf8"
            fillOpacity={0.45}
            strokeWidth={2.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
