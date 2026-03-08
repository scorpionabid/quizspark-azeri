import React from 'react';
import { motion } from 'framer-motion';

interface XPProgressCircleProps {
    xp: number;
    level: number;
    size?: number;
    strokeWidth?: number;
}

export const XPProgressCircle: React.FC<XPProgressCircleProps> = ({
    xp,
    level,
    size = 60,
    strokeWidth = 4,
}) => {
    // Simple formula: Level = floor(sqrt(XP / 100)) + 1
    // Conversely: Min XP for level L = (L-1)^2 * 100
    // Next level XP = L^2 * 100

    const currentLevelMinXP = Math.pow(level - 1, 2) * 100;
    const nextLevelMinXP = Math.pow(level, 2) * 100;
    const xpInCurrentLevel = xp - currentLevelMinXP;
    const xpForNextLevel = nextLevelMinXP - currentLevelMinXP;

    // Guard against division by zero if level formula changes
    const percentage = xpForNextLevel > 0
        ? Math.min(100, Math.max(0, (xpInCurrentLevel / xpForNextLevel) * 100))
        : 100;

    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="rotate-[-90deg]">
                {/* Background circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-muted/20"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    className="text-primary"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-black leading-none">{level}</span>
                <span className="text-[7px] font-bold opacity-70 leading-none mt-0.5 tracking-tighter">LVL</span>
            </div>
        </div>
    );
};
