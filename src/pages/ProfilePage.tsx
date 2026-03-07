import { useAuth } from "@/contexts/AuthContext";
import { useProfileStats } from "@/hooks/useProfileStats";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StudentProfile } from "@/components/profile/StudentProfile";
import { TeacherProfile } from "@/components/profile/TeacherProfile";

export default function ProfilePage() {
    const { user, profile, role } = useAuth();
    const { data: stats, isLoading: statsLoading } = useProfileStats();
    const { updateProfile, uploadAvatar, isUpdating } = useUpdateProfile();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    if (statsLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {/* Shared Header */}
                <ProfileHeader
                    profile={profile}
                    user={user}
                    role={role || 'student'}
                    updateProfile={updateProfile}
                    uploadAvatar={uploadAvatar}
                    isUpdating={isUpdating}
                />

                {/* Role Specific Content */}
                {role === 'teacher' ? (
                    <TeacherProfile stats={stats} />
                ) : (
                    <StudentProfile stats={stats} />
                )}
            </motion.div>
        </div>
    );
}
