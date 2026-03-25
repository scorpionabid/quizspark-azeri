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
import { Settings, Layout, Calendar, Zap, SkipForward, Shield, Palette, Clock, Lock, Compass, Image as ImageIcon, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SUBJECTS = [
    'Riyaziyyat', 'Fizika', 'Kimya', 'Biologiya', 'Tarix',
    'Coğrafiya', 'Ədəbiyyat', 'İngilis dili', 'Rus dili',
    'İnformatika', 'Musiqi', 'Təsviri incəsənət', 'Bədən tərbiyəsi',
    'Digər',
];

const SCHOOL_GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const UNI_GRADES = ['1-ci kurs', '2-ci kurs', '3-cü kurs', '4-cü kurs', 'Magistratura'];

interface QuizMetadataFormProps {
    form: UseFormReturn<QuizMetadataFormData>;
    isEditMode: boolean;
}

export function QuizMetadataForm({ form, isEditMode }: QuizMetadataFormProps) {
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

    const BACKGROUND_OPTIONS = [
        { label: 'Yoxdur', value: '' },
        { label: 'Dəftər vərəqi', value: '/backgrounds/paper-lined.svg' },
        { label: 'Riyaziyyat dəftəri', value: '/backgrounds/paper-graph.svg' },
        { label: 'Nöqtəli kağız', value: '/backgrounds/paper-dot.svg' },
    ];

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
                                                value={isCustomSubject ? 'Digər' : field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seçin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {SUBJECTS.map((s) => (
                                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {isCustomSubject && (
                                                <FormControl>
                                                    <Input
                                                        placeholder="Fənn adını yazın..."
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
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
                        <Accordion type="multiple" defaultValue={['design', 'security', 'time', 'navigation', 'permissions']} className="w-full space-y-4">
                            
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
                                                    {BACKGROUND_OPTIONS.map((bg) => (
                                                        <div 
                                                            key={bg.label} 
                                                            onClick={() => field.onChange(bg.value)}
                                                            className={`relative cursor-pointer rounded-xl border-2 transition-all overflow-hidden h-24 flex items-center justify-center bg-cover bg-center ${field.value === bg.value ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                                                            style={bg.value ? { backgroundImage: `url(${bg.value})` } : { backgroundColor: 'hsl(var(--muted))' }}
                                                        >
                                                            <div className="absolute inset-x-0 bottom-0 bg-background/90 backdrop-blur-sm p-1.5 text-center text-[10px] font-medium border-t">
                                                                {bg.label}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    
                                                    {/* Custom Upload */}
                                                    <div 
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden h-24 flex flex-col items-center justify-center gap-1 ${field.value && !BACKGROUND_OPTIONS.some(b => b.value === field.value) ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
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
                                                    <FormDescription>Yalnız şifrəni bilənlər testə daxil ola bilər</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="strict_mode"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4 border-red-200 dark:border-red-900/30">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-sm cursor-pointer text-red-600 dark:text-red-400">Ciddi Rejim (Anti-cheat)</FormLabel>
                                                        <FormDescription className="text-xs">Tab dəyişdikdə xəbərdarlıq edir</FormDescription>
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
                                </AccordionContent>
                            </AccordionItem>
                            
                            {/* Zaman Bölməsi */}
                            <AccordionItem value="time" className="border rounded-xl px-4 bg-muted/10">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span className="font-semibold">Zaman Bölməsi</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4">
                                    <div className="grid gap-6 sm:grid-cols-3">
                                        <FormField
                                            control={form.control}
                                            name="duration"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Müddət (dəq)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            max={300}
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>Testin ümumi vaxtı</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
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
                                                        <FormDescription className="text-xs">Sürətli cavaba +XP</FormDescription>
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
                                                        <FormLabel className="text-sm cursor-pointer">Sualları Qarışdır</FormLabel>
                                                        <FormDescription className="text-xs">Hər cəhddə fərqli sıra</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="show_feedback"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-sm cursor-pointer">Geri Bildirim</FormLabel>
                                                        <FormDescription className="text-xs">Cavablar və izahatlar göstərilir</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
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
