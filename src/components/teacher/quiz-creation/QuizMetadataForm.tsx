import { useState, useRef } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { QuizMetadataFormData } from '@/lib/validations/quiz';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { 
    Settings, Layout, Calendar, Zap, SkipForward, Shield, Palette, Clock, 
    Lock, Compass, Image as ImageIcon, Upload, MessageSquare, Sparkles, 
    CheckCircle2, ShieldCheck, TimerOff, HelpCircle, Shuffle, Check
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSubjects } from '@/hooks/useSubjects';
import { getSubjectIcon } from '@/lib/constants/subjects';
import { BACKGROUND_PRESETS } from '@/lib/constants/quizBackground';

const SCHOOL_GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const UNI_GRADES = ['1-ci kurs', '2-ci kurs', '3-cü kurs', '4-cü kurs', 'Magistratura'];

interface QuizMetadataFormProps {
    form: UseFormReturn<QuizMetadataFormData>;
    isEditMode: boolean;
}

export function QuizMetadataForm({ form, isEditMode }: QuizMetadataFormProps) {
    const { subjects, addCustomSubject } = useSubjects();
    const [isCustomSubject, setIsCustomSubject] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop() || 'png';
            const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('quiz_assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('quiz_assets')
                .getPublicUrl(filePath);

            onChange(data.publicUrl);
            toast.success('Fon şəkli uğurla yükləndi');
        } catch (error: unknown) {
            const errStr = error instanceof Error ? error.message : String(error);
            toast.error('Yükləmə xətası: ' + errStr);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const isStrictOrSeb = Boolean(form.watch('strict_mode') || form.watch('seb_config.enabled'));
    const currentDuration = form.watch('duration');
    const currentFeedback = form.watch('feedback_timing');

    let currentPreset: 'safe_exam' | 'practice' | 'standard' | 'custom' = 'custom';
    if (isStrictOrSeb) {
        currentPreset = 'safe_exam';
    } else if (currentDuration === 0 && currentFeedback === 'instant') {
        currentPreset = 'practice';
    } else if (currentDuration > 0 && currentFeedback === 'end_of_quiz' && !isStrictOrSeb) {
        currentPreset = 'standard';
    }

    const applySafeExamPreset = () => {
        form.setValue('strict_mode', true, { shouldDirty: true, shouldValidate: true });
        form.setValue('seb_config', {
            enabled: true,
            enforce_fullscreen: true,
            blur_on_leave: true,
            prevent_copy_paste: true,
            watermark_enabled: true,
            max_violations: 3,
        }, { shouldDirty: true, shouldValidate: true });
        form.setValue('feedback_timing', 'end_of_quiz', { shouldDirty: true, shouldValidate: true });
        form.setValue('show_feedback', true, { shouldDirty: true, shouldValidate: true });
        form.setValue('allow_backtracking', true, { shouldDirty: true, shouldValidate: true });
        form.setValue('questions_per_page', 1, { shouldDirty: true, shouldValidate: true });
        form.setValue('show_question_nav', true, { shouldDirty: true, shouldValidate: true });
        if (!form.getValues('duration') || form.getValues('duration') === 0) {
            form.setValue('duration', 45, { shouldDirty: true, shouldValidate: true });
        }
        toast.success('🛡️ Rəsmi İmtahan Rejimi tətbiq edildi (Safe Exam, su nişanı və kopyalama qadağası aktivdir)');
    };

    const applyPracticePreset = () => {
        form.setValue('strict_mode', false, { shouldDirty: true, shouldValidate: true });
        form.setValue('seb_config', {
            enabled: false,
            enforce_fullscreen: false,
            blur_on_leave: false,
            prevent_copy_paste: false,
            watermark_enabled: false,
            max_violations: 0,
        }, { shouldDirty: true, shouldValidate: true });
        form.setValue('duration', 0, { shouldDirty: true, shouldValidate: true });
        form.setValue('feedback_timing', 'instant', { shouldDirty: true, shouldValidate: true });
        form.setValue('show_feedback', true, { shouldDirty: true, shouldValidate: true });
        form.setValue('allow_backtracking', true, { shouldDirty: true, shouldValidate: true });
        form.setValue('show_question_nav', true, { shouldDirty: true, shouldValidate: true });
        toast.success('⚡ Öyrənmə və Sınaq Rejimi tətbiq edildi: Vaxt ləğv edildi (zamansız), dərhal doğru cavab və izah açılacaq.');
    };

    const applyStandardPreset = () => {
        form.setValue('strict_mode', false, { shouldDirty: true, shouldValidate: true });
        form.setValue('seb_config', {
            enabled: false,
            enforce_fullscreen: false,
            blur_on_leave: false,
            prevent_copy_paste: false,
            watermark_enabled: false,
            max_violations: 0,
        }, { shouldDirty: true, shouldValidate: true });
        form.setValue('feedback_timing', 'end_of_quiz', { shouldDirty: true, shouldValidate: true });
        form.setValue('show_feedback', true, { shouldDirty: true, shouldValidate: true });
        form.setValue('allow_backtracking', true, { shouldDirty: true, shouldValidate: true });
        form.setValue('show_question_nav', true, { shouldDirty: true, shouldValidate: true });
        form.setValue('enable_calculator', true, { shouldDirty: true, shouldValidate: true });
        form.setValue('enable_scratchpad', true, { shouldDirty: true, shouldValidate: true });
        if (!form.getValues('duration') || form.getValues('duration') === 0) {
            form.setValue('duration', 30, { shouldDirty: true, shouldValidate: true });
        }
        toast.success('📝 Standart Sınaq Rejimi tətbiq edildi: 30 dəqiqəlik taymer və alətlər aktivdir.');
    };



    return (
        <Form {...form}>
            <div className="mb-8 rounded-2xl bg-gradient-card border border-border/50 p-1 overflow-hidden">
                <Tabs defaultValue="general" className="w-full">
                    <div className="px-5 pt-4 flex items-center justify-between border-b border-border/30 pb-2">
                        <h2 className="font-display text-xl font-bold text-foreground">
                            {isEditMode ? 'Quiz Redaktəsi' : 'Quiz Məlumatları'}
                        </h2>
                        <TabsList className="bg-muted/50">
                            <TabsTrigger value="general" className="gap-2 text-xs">
                                <Layout className="h-3.5 w-3.5" />
                                Əsas
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="gap-2 text-xs">
                                <Settings className="h-3.5 w-3.5" />
                                Əlavə
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="general" className="p-6 mt-0">
                        <div className="grid gap-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quiz Başlığı *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Məs: Cəbr Əsasları" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Təsvir</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Quiz haqqında qısa məlumat..."
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fənn *</FormLabel>
                                            <Select
                                                onValueChange={(v) => {
                                                    if (v === 'Digər') {
                                                        setIsCustomSubject(true);
                                                        field.onChange('');
                                                    } else {
                                                        setIsCustomSubject(false);
                                                        field.onChange(v);
                                                    }
                                                }}
                                                value={isCustomSubject ? 'Digər' : (field.value || '')}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seçin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-72">
                                                    {subjects.map((s) => (
                                                        <SelectItem key={s} value={s}>
                                                            <span className="flex items-center gap-2">
                                                                <span className="text-base">{getSubjectIcon(s)}</span>
                                                                <span>{s}</span>
                                                            </span>
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem value="Digər" className="font-semibold text-primary border-t mt-1 pt-1.5 cursor-pointer">
                                                        <span className="flex items-center gap-2">
                                                            <span>➕</span>
                                                            <span>Digər (Yeni fənn yazın)...</span>
                                                        </span>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {isCustomSubject && (
                                                <FormControl>
                                                    <Input
                                                        placeholder="Fənn adını yazın..."
                                                        value={field.value || ''}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        onBlur={(e) => {
                                                            const val = e.target.value.trim();
                                                            if (val) addCustomSubject(val);
                                                        }}
                                                        autoFocus
                                                    />
                                                </FormControl>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="grade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sinif / Kurs</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seçin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Ümumi təhsil</SelectLabel>
                                                        {SCHOOL_GRADES.map((g) => (
                                                            <SelectItem key={g} value={`${g}-ci sinif`}>{g}-ci sinif</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                    <SelectGroup>
                                                        <SelectLabel>Ali təhsil</SelectLabel>
                                                        {UNI_GRADES.map((k) => (
                                                            <SelectItem key={k} value={`Ali məktəb (${k})`}>Ali məktəb ({k})</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="difficulty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Çətinlik</FormLabel>
                                            <Select
                                                onValueChange={(v) => field.onChange(v === 'none' ? null : v)}
                                                value={field.value ?? 'none'}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seçin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">Seçilməyib</SelectItem>
                                                    <SelectItem value="easy">Asan</SelectItem>
                                                    <SelectItem value="medium">Orta</SelectItem>
                                                    <SelectItem value="hard">Çətin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="p-6 mt-0">
                        {/* Sürətli İmtahan Rejimi (1-Klik Şablonlar) */}
                        <div className="mb-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background p-5 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                                        <h3 className="font-bold text-base text-foreground">Sürətli İmtahan Rejimləri (Şablonlar)</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Tək bir kliklə imtahanın bütün təhlükəsizlik, vaxt və izah parametrlərini avtomatik sazlayın
                                    </p>
                                </div>
                                <Badge 
                                    variant="outline" 
                                    className={`self-start sm:self-auto text-xs font-semibold px-3 py-1 gap-1.5 border ${
                                        currentPreset === 'safe_exam' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30' :
                                        currentPreset === 'practice' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                                        currentPreset === 'standard' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' :
                                        'bg-muted text-muted-foreground border-border'
                                    }`}
                                >
                                    <span className="h-2 w-2 rounded-full bg-current" />
                                    {currentPreset === 'safe_exam' && 'Aktiv: 🛡️ Safe Exam Rejimi'}
                                    {currentPreset === 'practice' && 'Aktiv: ⚡ Zamansız & Dərhal İzah'}
                                    {currentPreset === 'standard' && 'Aktiv: 📝 Standart Sınaq'}
                                    {currentPreset === 'custom' && 'Fərdi Tənzimləmə'}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                                {/* Preset 1: Safe Exam */}
                                <div 
                                    onClick={applySafeExamPreset}
                                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex flex-col justify-between ${
                                        currentPreset === 'safe_exam'
                                            ? 'border-red-500 bg-red-500/10 shadow-md ring-2 ring-red-500/20'
                                            : 'border-border/80 bg-background/60 hover:border-red-400/60 hover:bg-red-500/5'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                                                    <ShieldCheck className="h-5 w-5" />
                                                </div>
                                                <span className="font-bold text-sm text-foreground">Rəsmi İmtahan</span>
                                            </div>
                                            {currentPreset === 'safe_exam' && (
                                                <CheckCircle2 className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                            Anti-cheat qorumalı ciddi imtahanlar üçün. Brauzer kilidlənir, tam ekran məcburidir, kopyalama qadağandır.
                                        </p>
                                    </div>
                                    <div className="space-y-1.5 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Check className="h-3.5 w-3.5 text-red-500" />
                                            <span>Məcburi Tam Ekran & Bulanıqlaşma</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Check className="h-3.5 w-3.5 text-red-500" />
                                            <span>Kopyalama & Sağ klik qadağası</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Check className="h-3.5 w-3.5 text-red-500" />
                                            <span>Şagird Su Nişanı & İzahlar sonda</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Preset 2: Practice / Sınaq */}
                                <div 
                                    onClick={applyPracticePreset}
                                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex flex-col justify-between ${
                                        currentPreset === 'practice'
                                            ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/20'
                                            : 'border-border/80 bg-background/60 hover:border-emerald-400/60 hover:bg-emerald-500/5'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                    <Zap className="h-5 w-5" />
                                                </div>
                                                <span className="font-bold text-sm text-foreground">Öyrənmə & Məşq</span>
                                            </div>
                                            {currentPreset === 'practice' && (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                            Öyrənmə və mövzu testləri üçün. Vaxt məhdudiyyəti yoxdur, hər sualdan sonra dərhal cavab və izah açılır.
                                        </p>
                                    </div>
                                    <div className="space-y-1.5 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                                            <span className="font-semibold text-foreground">⏱️ Limitsiz Vaxt (Zamansız)</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                                            <span className="font-semibold text-foreground">⚡ Dərhal Doğru Cavab və İzah</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                                            <span>Sərbəst Naviqasiya & Sual Xəritəsi</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Preset 3: Standard Quiz */}
                                <div 
                                    onClick={applyStandardPreset}
                                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex flex-col justify-between ${
                                        currentPreset === 'standard'
                                            ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                                            : 'border-border/80 bg-background/60 hover:border-primary/60 hover:bg-primary/5'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                                    <Layout className="h-5 w-5" />
                                                </div>
                                                <span className="font-bold text-sm text-foreground">Standart Sınaq</span>
                                            </div>
                                            {currentPreset === 'standard' && (
                                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                            Klassik məktəb və dərnək sınaqları üçün. Vaxt limitli, köməkçi alətlər aktiv, izahlar yekunda.
                                        </p>
                                    </div>
                                    <div className="space-y-1.5 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Check className="h-3.5 w-3.5 text-primary" />
                                            <span>30 dəqiqəlik standart taymer</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Check className="h-3.5 w-3.5 text-primary" />
                                            <span>İzahlar imtahan bitdikdə</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Check className="h-3.5 w-3.5 text-primary" />
                                            <span>Kalkulyator & Qaralama aktiv</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Accordion type="multiple" defaultValue={['security', 'time', 'appearance', 'navigation', 'permissions']} className="w-full space-y-4">
                            
                            {/* Dizayn və Fon Şəkli */}
                            <AccordionItem value="design" className="border rounded-xl px-4 bg-muted/10">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4 text-primary" />
                                        <span className="font-semibold">Dizayn və Fon Şəkli</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4">
                                    <FormField
                                        control={form.control}
                                        name="background_image_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Test Fonu (Background)</FormLabel>
                                                <FormDescription>Test zamanı arxa planda görünəcək şəkli seçin və ya yükləyin</FormDescription>
                                                
                                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 mb-4">
                                                    {BACKGROUND_PRESETS.map((bg) => (
                                                        <div 
                                                            key={bg.label} 
                                                            onClick={() => field.onChange(bg.value)}
                                                            className={`relative cursor-pointer rounded-xl border-2 transition-all overflow-hidden h-24 flex items-center justify-center bg-card ${field.value === bg.value ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-border hover:border-primary/50'}`}
                                                            style={bg.value ? { backgroundImage: `url(${bg.value})`, backgroundRepeat: 'repeat' } : { backgroundColor: 'hsl(var(--muted))' }}
                                                        >
                                                            <div className="absolute inset-x-0 bottom-0 bg-background/90 backdrop-blur-sm p-1.5 text-center text-[10px] font-medium border-t">
                                                                {bg.label}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    
                                                    {/* Custom Upload */}
                                                    <div 
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden h-24 flex flex-col items-center justify-center gap-1 ${field.value && !BACKGROUND_PRESETS.some(b => b.value === field.value) ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
                                                    >
                                                        <input 
                                                            type="file" 
                                                            ref={fileInputRef}
                                                            className="hidden" 
                                                            accept="image/*"
                                                            onChange={(e) => handleFileUpload(e, field.onChange)}
                                                            disabled={isUploading}
                                                        />
                                                        {isUploading ? (
                                                            <div className="text-[10px] text-muted-foreground animate-pulse">Yüklənir...</div>
                                                        ) : (
                                                            <>
                                                                <Upload className="h-5 w-5 text-muted-foreground" />
                                                                <div className="text-[10px] text-muted-foreground font-medium text-center px-1">
                                                                    Öz Şəkliniz
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Və ya şəkil URL-i daxil edin..." 
                                                        {...field} 
                                                        value={field.value ?? ''}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                            
                            {/* Təhlükəsizlik Bölməsi */}
                            <AccordionItem value="security" className="border rounded-xl px-4 bg-red-50/50 dark:bg-red-950/10">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-red-500" />
                                        <span className="font-semibold text-red-700 dark:text-red-400">Təhlükəsizlik və Nəzarət</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="access_password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Şifrəli Giriş</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            placeholder="Boş qoysanız hər kəsə açıq olacaq"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Yalnız şifrəni bilənlər testə daxil ola bilər (Qeyd: İmtahanın tapılması üçün sistem avtomatik 6 rəqəmli PIN Kod təyin edir; tələbələr əvvəlcə PIN kodla testi tapır, sonra bu şifrəni daxil edirlər).
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="space-y-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/20 p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                        <FormLabel className="text-base font-bold text-red-700 dark:text-red-300">
                                                            Təhlükəsiz İmtahan Rejimi (Safe Exam Browser)
                                                        </FormLabel>
                                                    </div>
                                                    <FormDescription className="text-xs text-red-600/80 dark:text-red-400/80">
                                                        Rəsmi imtahanlar üçün saxtakarlığın (tab dəyişmə, ekran şəkli, kopyalama, kənar proqramlar) qarşısını alan qabaqcıl qorunma sistemi
                                                    </FormDescription>
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="strict_mode"
                                                    render={({ field }) => (
                                                        <FormControl>
                                                            <Switch
                                                                checked={Boolean(field.value || form.watch('seb_config.enabled'))}
                                                                onCheckedChange={(checked) => {
                                                                    field.onChange(checked);
                                                                    const currentSeb = form.getValues('seb_config') || {};
                                                                    form.setValue('seb_config', {
                                                                        ...currentSeb,
                                                                        enabled: checked,
                                                                    }, { shouldDirty: true, shouldValidate: true });
                                                                    form.setValue('seb_config.enabled', checked, { shouldDirty: true, shouldValidate: true });
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                />
                                            </div>

                                            {(form.watch('strict_mode') || form.watch('seb_config.enabled')) && (
                                                <div className="pt-4 border-t border-red-200 dark:border-red-900/40 space-y-4 animate-in fade-in duration-200">
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        {/* Fullscreen Enforce */}
                                                        <FormField
                                                            control={form.control}
                                                            name="seb_config.enforce_fullscreen"
                                                            render={({ field }) => (
                                                                <FormItem className="flex items-center justify-between rounded-lg border bg-background/80 p-3 shadow-xs">
                                                                    <div className="space-y-0.5 pr-2">
                                                                        <FormLabel className="text-xs font-semibold cursor-pointer">Məcburi Tam Ekran</FormLabel>
                                                                        <FormDescription className="text-[11px]">İmtahan yalnız tam ekranda verilir, çıxdıqda suallar bloklanır</FormDescription>
                                                                    </div>
                                                                    <FormControl>
                                                                        <Switch checked={field.value ?? true} onCheckedChange={field.onChange} />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Blur on Leave */}
                                                        <FormField
                                                            control={form.control}
                                                            name="seb_config.blur_on_leave"
                                                            render={({ field }) => (
                                                                <FormItem className="flex items-center justify-between rounded-lg border bg-background/80 p-3 shadow-xs">
                                                                    <div className="space-y-0.5 pr-2">
                                                                        <FormLabel className="text-xs font-semibold cursor-pointer">Ekran Şəkli & Kənar Proqram Qorunması</FormLabel>
                                                                        <FormDescription className="text-[11px]">Pəncərə fokusunu itirdikdə suallar dərhal bulanıqlaşır, PrintScreen silinir</FormDescription>
                                                                    </div>
                                                                    <FormControl>
                                                                        <Switch checked={field.value ?? true} onCheckedChange={field.onChange} />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Copy/Paste Lock */}
                                                        <FormField
                                                            control={form.control}
                                                            name="seb_config.prevent_copy_paste"
                                                            render={({ field }) => (
                                                                <FormItem className="flex items-center justify-between rounded-lg border bg-background/80 p-3 shadow-xs">
                                                                    <div className="space-y-0.5 pr-2">
                                                                        <FormLabel className="text-xs font-semibold cursor-pointer">Kopyalama & Sağ Klik Qadağası</FormLabel>
                                                                        <FormDescription className="text-[11px]">Sual mətni seçilə, kopyalana bilməz, sağ klik və DevTools bloklanır</FormDescription>
                                                                    </div>
                                                                    <FormControl>
                                                                        <Switch checked={field.value ?? true} onCheckedChange={field.onChange} />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Watermark */}
                                                        <FormField
                                                            control={form.control}
                                                            name="seb_config.watermark_enabled"
                                                            render={({ field }) => (
                                                                <FormItem className="flex items-center justify-between rounded-lg border bg-background/80 p-3 shadow-xs">
                                                                    <div className="space-y-0.5 pr-2">
                                                                        <FormLabel className="text-xs font-semibold cursor-pointer">Şagird Su Nişanı (Watermark)</FormLabel>
                                                                        <FormDescription className="text-[11px]">Ekranda FİN və ad şəffaf şəkildə əks olunur (telefonla çəkilişə qarşı)</FormDescription>
                                                                    </div>
                                                                    <FormControl>
                                                                        <Switch checked={field.value ?? true} onCheckedChange={field.onChange} />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    {/* Violation Limit */}
                                                    <FormField
                                                        control={form.control}
                                                        name="seb_config.max_violations"
                                                        render={({ field }) => (
                                                            <FormItem className="rounded-lg border bg-background/80 p-3 shadow-xs">
                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                                    <div className="space-y-0.5">
                                                                        <FormLabel className="text-xs font-semibold">Qayda Pozuntusu Həddi (Avto-Təhvil)</FormLabel>
                                                                        <FormDescription className="text-[11px]">
                                                                            İştirakçı pəncərəni tərk etdikdə xəbərdarlıq limiti
                                                                        </FormDescription>
                                                                    </div>
                                                                    <Select
                                                                        value={String(field.value ?? 3)}
                                                                        onValueChange={(val) => field.onChange(Number(val))}
                                                                    >
                                                                        <FormControl>
                                                                            <SelectTrigger className="w-full sm:w-[260px] h-9 text-xs">
                                                                                <SelectValue placeholder="Limit seçin" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            <SelectItem value="3">3 xəbərdarlıqdan sonra bitir (Tövsiyə olunan)</SelectItem>
                                                                            <SelectItem value="5">5 xəbərdarlıqdan sonra bitir</SelectItem>
                                                                            <SelectItem value="0">Yalnız qeyd et (İmtahanı kəsmə)</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Sual İdarəetməsi (Naviqasiya) */}
                            <AccordionItem value="navigation" className="border rounded-xl px-4 bg-muted/10">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-2">
                                        <Compass className="h-4 w-4 text-primary" />
                                        <span className="font-semibold">Sual Qaydaları və Naviqasiya</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4">
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                        <FormField
                                            control={form.control}
                                            name="questions_per_page"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Səhifələmə (Say)</FormLabel>
                                                    <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value ?? 1)}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Seçin" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">1 Sual (Tək-tək)</SelectItem>
                                                            <SelectItem value="5">Səhifədə 5 Sual</SelectItem>
                                                            <SelectItem value="10">Səhifədə 10 Sual</SelectItem>
                                                            <SelectItem value="0">Bütün Suallar (Siyahı)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>Bir səhifədə görünəcək sual sayı</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="allow_backtracking"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-sm cursor-pointer">Geriyə Qayıtmaq</FormLabel>
                                                        <FormDescription className="text-xs">Əvvəlki suala icazə</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="allow_bookmarks"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-sm cursor-pointer">Sancaq (Bookmark)</FormLabel>
                                                        <FormDescription className="text-xs">Sualı yadda saxlamaq</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="show_question_nav"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-sm cursor-pointer">Kənar Naviqasiya</FormLabel>
                                                        <FormDescription className="text-xs">Böyük testlər üçün panel</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Köməkçi Alətlərin Görünmə İdarəetməsi */}
                                    <div className="mt-5 pt-4 border-t border-border/60">
                                        <div className="mb-3">
                                            <h4 className="text-sm font-semibold text-foreground">
                                                Köməkçi Alətlər (Sual Xəritəsinin Altında)
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                İmtahan zamanı sağ paneldə şagirdlər üçün hansı köməkçi alətlərin aktiv olacağını seçin
                                            </p>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <FormField
                                                control={form.control}
                                                name="enable_calculator"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-sm cursor-pointer">🧮 Hesab Makinası</FormLabel>
                                                            <FormDescription className="text-xs">Elmi/məktəb kalkulyatoru</FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch checked={field.value ?? true} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="enable_periodic_table"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-sm cursor-pointer">🧪 Mendeleyev Cədvəli</FormLabel>
                                                            <FormDescription className="text-xs">Dövri sistem və aktivlik sırası</FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch checked={field.value ?? true} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="enable_scratchpad"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-sm cursor-pointer">✏️ Qələm və Pozan</FormLabel>
                                                            <FormDescription className="text-xs">Bağlanan kimi sıfırlanan qaralama</FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch checked={field.value ?? true} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            
                            {/* Zaman Bölməsi */}
                            <AccordionItem value="time" className="border rounded-xl px-4 bg-muted/10">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span className="font-semibold">Zaman və Taymer Tənzimləməsi</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="duration"
                                            render={({ field }) => {
                                                const isTimeless = !field.value || field.value === 0;
                                                return (
                                                    <FormItem className="col-span-full space-y-3 rounded-xl border bg-background p-4">
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-sm font-semibold flex items-center gap-2">
                                                                    <Clock className="h-4 w-4 text-primary" />
                                                                    İmtahan Taymeri və Müddət
                                                                </FormLabel>
                                                                <FormDescription className="text-xs">
                                                                    İmtahana ümumi vaxt limiti qoyun və ya limitsiz zamansız rejim seçin
                                                                </FormDescription>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-medium text-muted-foreground">
                                                                    {isTimeless ? '⏱️ Zamansız Rejim' : `⏱️ ${field.value} dəqiqə`}
                                                                </span>
                                                                <Switch 
                                                                    checked={!isTimeless}
                                                                    onCheckedChange={(checked) => {
                                                                        if (checked) {
                                                                            field.onChange(30);
                                                                        } else {
                                                                            field.onChange(0);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {isTimeless ? (
                                                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                                                                <div className="flex items-start gap-3">
                                                                    <TimerOff className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                                                    <div className="space-y-0.5">
                                                                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                                                            ⏱️ Zamansız Sınaq Rejimi Aktivdir
                                                                        </span>
                                                                        <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400/90">
                                                                            Heç bir vaxt məhdudiyyəti və ya geri sayım olmayacaq. İştirakçı istədiyi qədər düşünüb sualları təhlil edə bilər.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => field.onChange(30)}
                                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-background/80 hover:bg-background text-emerald-800 dark:text-emerald-200 transition-colors shrink-0"
                                                                >
                                                                    Taymer Təyin Et (30 dəq)
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-3 pt-2 border-t border-border/40 animate-in fade-in duration-200">
                                                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                                    <div className="w-full sm:w-48">
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                min={1}
                                                                                max={300}
                                                                                placeholder="Müddət (dəq)"
                                                                                value={field.value}
                                                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                                            />
                                                                        </FormControl>
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                                        <span className="text-xs text-muted-foreground mr-1">Sürətli:</span>
                                                                        {[15, 20, 30, 45, 60, 90, 120].map((mins) => (
                                                                            <button
                                                                                key={mins}
                                                                                type="button"
                                                                                onClick={() => field.onChange(mins)}
                                                                                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                                                                                    field.value === mins 
                                                                                        ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs' 
                                                                                        : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                                                                                }`}
                                                                            >
                                                                                {mins} dəq
                                                                            </button>
                                                                        ))}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => field.onChange(0)}
                                                                            className="text-xs px-2.5 py-1 rounded-lg border border-dashed text-muted-foreground hover:text-emerald-600 hover:border-emerald-500 transition-colors ml-1"
                                                                        >
                                                                            ⏱️ Zamansız et
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <FormMessage />
                                                            </div>
                                                        )}
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="time_bonus_enabled"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-3">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-sm cursor-pointer flex items-center gap-2">
                                                            Zaman Bonusu
                                                        </FormLabel>
                                                        <FormDescription className="text-xs">Sürətli cavaba +XP bal</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="time_penalty_enabled"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-3">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-sm cursor-pointer flex items-center gap-2 text-destructive">
                                                            Zaman Cəriməsi
                                                        </FormLabel>
                                                        <FormDescription className="text-xs">Səhv cavabda vaxt azalır</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Görünüş Bölməsi */}
                            <AccordionItem value="appearance" className="border rounded-xl px-4 bg-muted/10">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-2">
                                        <Palette className="h-4 w-4 text-primary" />
                                        <span className="font-semibold">Görünüş Bölməsi</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4">
                                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                                        <FormField
                                            control={form.control}
                                            name="shuffle_questions"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-sm cursor-pointer flex items-center gap-1.5">
                                                            <Shuffle className="h-4 w-4 text-primary" />
                                                            Sualları Qarışdır
                                                        </FormLabel>
                                                        <FormDescription className="text-xs">Hər cəhddə sualların sırası fərqli olsun</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shuffle_options"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-sm cursor-pointer flex items-center gap-1.5">
                                                            <Shuffle className="h-4 w-4 text-primary" />
                                                            Variantları Qarışdır (A, B, C, D)
                                                        </FormLabel>
                                                        <FormDescription className="text-xs">Hər sualın daxilində variantların sırası qarışdırılsın</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="feedback_timing"
                                            render={({ field }) => {
                                                const currentVal = field.value || (form.watch('show_feedback') === false ? 'never' : 'end_of_quiz');
                                                return (
                                                    <FormItem className="col-span-full space-y-3 rounded-xl border bg-background p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-sm font-semibold flex items-center gap-2">
                                                                <MessageSquare className="h-4 w-4 text-primary" />
                                                                Cavab və İzahların Göstərilmə Zamanı
                                                            </FormLabel>
                                                            <FormDescription className="text-xs">
                                                                Düzgün/səhv cavabların və sual izahatlarının şagirdə nə vaxt göstəriləcəyini seçin
                                                            </FormDescription>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                                            {/* 1. End of Quiz */}
                                                            <div
                                                                onClick={() => {
                                                                    field.onChange('end_of_quiz');
                                                                    form.setValue('show_feedback', true);
                                                                }}
                                                                className={`cursor-pointer rounded-xl border-2 p-3 transition-all flex flex-col justify-between ${currentVal === 'end_of_quiz' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                                                            >
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-1.5">
                                                                        <span className="font-semibold text-xs text-foreground">🎓 İmtahan Bitdikdə</span>
                                                                        <Badge variant="outline" className="text-[10px] px-1 py-0 text-primary border-primary/30">Tövsiyə</Badge>
                                                                    </div>
                                                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                                        Test zamanı vaxt itkisi olmur. Bütün düzgün/səhv cavablar və izahatlar yalnız imtahan bitdikdə nəticə səhifəsində göstərilir.
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* 2. Instant */}
                                                            <div
                                                                onClick={() => {
                                                                    field.onChange('instant');
                                                                    form.setValue('show_feedback', true);
                                                                }}
                                                                className={`cursor-pointer rounded-xl border-2 p-3 transition-all flex flex-col justify-between ${currentVal === 'instant' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                                                            >
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-1.5">
                                                                        <span className="font-semibold text-xs text-foreground">⚡ Dərhal (Məşq)</span>
                                                                    </div>
                                                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                                        Hər sualdan və ya səhifədən sonra dərhal düzgün cavab və izahat açılır. Öyrənmə məqsədli quizlər üçün uyğundur.
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* 3. Never */}
                                                            <div
                                                                onClick={() => {
                                                                    field.onChange('never');
                                                                    form.setValue('show_feedback', false);
                                                                }}
                                                                className={`cursor-pointer rounded-xl border-2 p-3 transition-all flex flex-col justify-between ${currentVal === 'never' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                                                            >
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-1.5">
                                                                        <span className="font-semibold text-xs text-foreground">🔒 Heç vaxt (Qapalı)</span>
                                                                    </div>
                                                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                                        Cavablar və izahatlar gizli saxlanılır. Şagirdə yalnız yekun bal və faiz göstərilir.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="auto_advance"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-sm cursor-pointer flex items-center gap-2">
                                                            <SkipForward className="h-4 w-4 text-primary" />
                                                            Avtokeçid
                                                        </FormLabel>
                                                        <FormDescription className="text-xs">
                                                            {field.value ? 'Cavabdan sonra test irəliləyir' : 'Əllə düyməyə basılır'}
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Səlahiyyət Bölməsi */}
                            <AccordionItem value="permissions" className="border rounded-xl px-4 bg-muted/10">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-primary" />
                                        <span className="font-semibold">Səlahiyyət Bölməsi</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4">
                                    <div className="grid gap-6 sm:grid-cols-3">
                                        <FormField
                                            control={form.control}
                                            name="is_public"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col justify-center gap-2 rounded-lg border bg-background p-4">
                                                    <FormLabel className="text-sm">Görünüşmə Stili</FormLabel>
                                                    <div className="flex items-center gap-3">
                                                        <FormControl>
                                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <span className="text-sm font-medium">{field.value ? 'İctimai (Hər kəsə)' : 'Şəxsi (Linklə)'}</span>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="pass_percentage"
                                            render={({ field }) => (
                                                <FormItem className="rounded-lg border bg-background p-4">
                                                    <FormLabel className="text-sm">Keçid Balı (%)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            max={100}
                                                            className="mt-2"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="attempts_limit"
                                            render={({ field }) => (
                                                <FormItem className="rounded-lg border bg-background p-4">
                                                    <FormLabel className="text-sm">Cəhd Limiti</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            max={100}
                                                            className="mt-2"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Planlaşdırma Bölməsi */}
                            <AccordionItem value="scheduling" className="border rounded-xl px-4 bg-muted/10">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        <span className="font-semibold">Planlaşdırma</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="available_from"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Açılış Zamanı</FormLabel>
                                                    <FormControl>
                                                        <Input type="datetime-local" {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormDescription>Quiz nə vaxtdan əlçatan olsun?</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="available_to"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Qapanış Zamanı</FormLabel>
                                                    <FormControl>
                                                        <Input type="datetime-local" {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormDescription>Quiz nə vaxt bağlansın?</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
                    </TabsContent>
                </Tabs>
            </div>
        </Form>
    );
}
