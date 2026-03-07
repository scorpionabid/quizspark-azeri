import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
    profile: { full_name: string | null; avatar_url: string | null } | null;
    user: { email?: string; created_at?: string } | null;
    role: string;
    updateProfile: (data: { full_name: string }) => Promise<{ error: unknown }>;
    uploadAvatar: (file: File) => Promise<unknown>;
    isUpdating: boolean;
}

export function ProfileHeader({ profile, user, role, updateProfile, uploadAvatar, isUpdating }: ProfileHeaderProps) {
    const [newFullName, setNewFullName] = useState(profile?.full_name || "");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpdateName = async () => {
        const { error } = await updateProfile({ full_name: newFullName });
        if (!error) setIsEditDialogOpen(false);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadAvatar(file);
        }
    };

    const getInitials = () => {
        if (profile?.full_name) {
            return profile.full_name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        return user?.email?.slice(0, 2).toUpperCase() || "U";
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-xl">
            <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
            <div className="px-8 pb-8 flex flex-col md:flex-row items-end -mt-12 gap-6">
                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                    <Avatar className="h-32 w-32 border-4 border-background shadow-2xl transition-transform group-hover:scale-95 duration-200">
                        <AvatarImage src={profile?.avatar_url || ""} />
                        <AvatarFallback className="text-4xl bg-primary/10 text-primary uppercase">
                            {getInitials()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        {isUpdating ? <Loader2 className="h-8 w-8 animate-spin text-white" /> : <Edit2 className="h-8 w-8 text-white" />}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <div className="flex-1 space-y-2 mb-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">{profile?.full_name || "İstifadəçi"}</h1>
                        <Badge variant={role === 'student' ? 'outline' : role === 'teacher' ? 'secondary' : 'destructive'} className="capitalize">
                            {role === 'student' ? 'Şagird' : role === 'teacher' ? 'Müəllim' : 'Admin'}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        Üzvilik: {user?.created_at ? new Date(user.created_at).toLocaleDateString('az-AZ', { month: 'long', year: 'numeric' }) : 'Yanvar 2024'}
                    </p>
                </div>

                <div className="flex gap-3 mb-2">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2 shadow-lg">
                                <Edit2 className="h-4 w-4" />
                                Redaktə Et
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Profili Redaktə Et</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Ad Soyad</Label>
                                    <Input
                                        id="fullName"
                                        value={newFullName}
                                        onChange={(e) => setNewFullName(e.target.value)}
                                        placeholder="Adınız Soyadınız"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Ləğv Et</Button>
                                <Button onClick={handleUpdateName} disabled={isUpdating}>
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Yadda Saxla
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </motion.div>
    );
}
