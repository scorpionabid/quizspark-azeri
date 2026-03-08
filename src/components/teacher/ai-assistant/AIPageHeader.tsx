import { Sparkles } from "lucide-react";

export function AIPageHeader() {
    return (
        <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm text-accent">
                <Sparkles className="h-4 w-4" />
                <span>AI Köməkçi</span>
            </div>
            <h1 className="mb-2 font-display text-3xl font-bold text-foreground">
                Süni Zəka ilə Test Sualı Yaradın
            </h1>
            <p className="text-muted-foreground">
                Şablon istifadə edin, sənəddən və ya mövzu üzrə suallar yaradın
            </p>
        </div>
    );
}
