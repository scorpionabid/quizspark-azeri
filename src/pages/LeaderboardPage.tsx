import { Trophy } from "lucide-react";
import { SimpleLeaderboard } from "@/components/student/gamification/SimpleLeaderboard";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-xs font-black text-secondary uppercase tracking-widest border border-secondary/20"
          >
            <Trophy className="h-4 w-4" />
            <span>Rəqabətədavamlılıq</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-3 font-display text-4xl font-black text-foreground sm:text-6xl tracking-tight"
          >
            Ən Yaxşı <span className="text-primary italic">Abituriyentlər</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-medium text-lg"
          >
            Hər gün test həll et, XP qazan və zirvəyə yüksəl!
          </motion.p>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-2xl"
          >
            <SimpleLeaderboard />
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              10 XP = Sual
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Alov = Davamlılıq
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              50 XP = Bonus
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
