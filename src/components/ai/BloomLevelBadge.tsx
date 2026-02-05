 import { cn } from "@/lib/utils";
 import { Badge } from "@/components/ui/badge";
 import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
 } from "@/components/ui/tooltip";
 
 export type BloomLevel = 
   | "remembering" 
   | "understanding" 
   | "applying" 
   | "analyzing" 
   | "evaluating" 
   | "creating";
 
 interface BloomLevelBadgeProps {
   level: BloomLevel | string | null | undefined;
   showTooltip?: boolean;
   size?: "sm" | "md";
 }
 
 const bloomConfig: Record<BloomLevel, { 
   label: string; 
   labelAz: string;
   color: string; 
   bgColor: string;
   description: string;
 }> = {
   remembering: {
     label: "Remembering",
     labelAz: "Yadda saxlama",
     color: "text-blue-700 dark:text-blue-400",
     bgColor: "bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-800",
     description: "Faktları və əsas anlayışları xatırlama",
   },
   understanding: {
     label: "Understanding",
     labelAz: "Anlama",
     color: "text-green-700 dark:text-green-400",
     bgColor: "bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-800",
     description: "Fikirləri izah etmə və təfsir etmə",
   },
   applying: {
     label: "Applying",
     labelAz: "Tətbiqetmə",
     color: "text-yellow-700 dark:text-yellow-400",
     bgColor: "bg-yellow-100 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800",
     description: "Məlumatı yeni situasiyalarda istifadə etmə",
   },
   analyzing: {
     label: "Analyzing",
     labelAz: "Analiz",
     color: "text-orange-700 dark:text-orange-400",
     bgColor: "bg-orange-100 dark:bg-orange-950 border-orange-300 dark:border-orange-800",
     description: "Əlaqələri aşkar etmə, müqayisə etmə",
   },
   evaluating: {
     label: "Evaluating",
     labelAz: "Qiymətləndirmə",
     color: "text-red-700 dark:text-red-400",
     bgColor: "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-800",
     description: "Qərarlar vermə və mühakimə yürütmə",
   },
   creating: {
     label: "Creating",
     labelAz: "Yaratma",
     color: "text-purple-700 dark:text-purple-400",
     bgColor: "bg-purple-100 dark:bg-purple-950 border-purple-300 dark:border-purple-800",
     description: "Yeni və orijinal işlər yaratma",
   },
 };
 
 export function BloomLevelBadge({ level, showTooltip = true, size = "sm" }: BloomLevelBadgeProps) {
   if (!level) return null;
 
   const normalizedLevel = level.toLowerCase() as BloomLevel;
   const config = bloomConfig[normalizedLevel];
 
   if (!config) return null;
 
   const badge = (
     <Badge
       variant="outline"
       className={cn(
         "font-medium border",
         config.bgColor,
         config.color,
         size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"
       )}
     >
       {config.labelAz}
     </Badge>
   );
 
   if (!showTooltip) return badge;
 
   return (
     <TooltipProvider>
       <Tooltip>
         <TooltipTrigger asChild>
           {badge}
         </TooltipTrigger>
         <TooltipContent>
           <div className="space-y-1">
             <p className="font-medium">{config.label}</p>
             <p className="text-xs text-muted-foreground">{config.description}</p>
           </div>
         </TooltipContent>
       </Tooltip>
     </TooltipProvider>
   );
 }
 
 export function getBloomLevels(): { value: BloomLevel; label: string }[] {
   return Object.entries(bloomConfig).map(([key, config]) => ({
     value: key as BloomLevel,
     label: config.labelAz,
   }));
 }