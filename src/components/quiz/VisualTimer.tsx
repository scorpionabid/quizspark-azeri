import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface VisualTimerProps {
    timeLeft: number;
    totalTime: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
    showIcon?: boolean;
}

export function VisualTimer({
    timeLeft,
    totalTime,
    size = 60,
    strokeWidth = 4,
    className,
    showIcon = true,
}: VisualTimerProps) {
    const percentage = (timeLeft / totalTime) * 100;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    // Determine color based on time left
    const getColor = () => {
        if (percentage <= 20) return "text-destructive";
        if (percentage <= 50) return "text-warning";
        return "text-primary";
    };

    const getBgColor = () => {
        if (percentage <= 20) return "bg-destructive/10";
        if (percentage <= 50) return "bg-warning/10";
        return "bg-muted";
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={cn("relative flex items-center gap-3", className)}>
            <div
                className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 transition-colors duration-500",
                    getBgColor()
                )}
            >
                {showIcon && <Clock className={cn("h-4 w-4", getColor())} />}
                <span className={cn("font-mono font-bold text-sm", getColor())}>
                    {formatTime(timeLeft)}
                </span>
            </div>

            <div className="relative" style={{ width: size, height: size }}>
                {/* Background Circle */}
                <svg className="h-full w-full -rotate-90 transform">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-muted/30"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1, ease: "linear" }}
                        strokeLinecap="round"
                        className={cn("transition-colors duration-500", getColor())}
                    />
                </svg>

                {/* Percentage text (optional, small) */}
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-muted-foreground/50">
                    {Math.ceil(percentage)}%
                </div>
            </div>
        </div>
    );
}
