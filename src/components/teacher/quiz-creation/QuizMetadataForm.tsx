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
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { QuizMetadataFormData } from '@/lib/validations/quiz';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Info, Layout, Image as ImageIcon, Calendar, Zap, AlertCircle } from 'lucide-react';

interface QuizMetadataFormProps {
    form: UseFormReturn<QuizMetadataFormData>;
    isEditMode: boolean;
}

export function QuizMetadataForm({ form, isEditMode }: QuizMetadataFormProps) {
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
                                Ümumi
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="gap-2 text-xs">
                                <Settings className="h-3.5 w-3.5" />
                                Nizamlamalar
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
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seçin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {['Riyaziyyat', 'Fizika', 'Kimya', 'Biologiya', 'Tarix', 'Coğrafiya', 'Ədəbiyyat', 'İngilis dili', 'İnformatika'].map((s) => (
                                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="grade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sinif</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seçin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {[5, 6, 7, 8, 9, 10, 11].map((g) => (
                                                        <SelectItem key={g} value={`${g}-ci sinif`}>{g}-ci sinif</SelectItem>
                                                    ))}
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="p-6 mt-0">
                        <div className="grid gap-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="shuffle_questions"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base cursor-pointer">Sualları Qarışdır</FormLabel>
                                                <FormDescription>Sualların ardıcıllığı hər cəhddə dəyişəcək</FormDescription>
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
                                        <FormItem className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base cursor-pointer">Geri Bildirim</FormLabel>
                                                <FormDescription>Bitirdikdən sonra cavablar və izahatlar göstərilsin</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Scheduling Section */}
                            <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                                <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    Planlaşdırma
                                </h3>
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
                            </div>

                            {/* Timing Options */}
                            <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                                <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                                    <Zap className="h-4 w-4 text-primary" />
                                    Zaman Effektləri
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="time_bonus_enabled"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-3">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-sm cursor-pointer flex items-center gap-2">
                                                        Zaman Bonusu
                                                    </FormLabel>
                                                    <FormDescription className="text-xs">Sürətli cavaba görə +XP</FormDescription>
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
                                                    <FormDescription className="text-xs">Səhv cavabda vaxtın azalması</FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-3">
                                <FormField
                                    control={form.control}
                                    name="pass_percentage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Keçid Balı (%)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>Minimum keçid faizi</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="attempts_limit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cəhd Limiti</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={100}
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>Maksimum cəhd sayı</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="is_public"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col justify-center gap-2">
                                            <FormLabel>Görünüş</FormLabel>
                                            <div className="flex items-center gap-3">
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <span className="text-sm font-medium">{field.value ? 'İctimai' : 'Şəxsi'}</span>
                                            </div>
                                            <FormDescription>Quiz hər kəsə açıq olsun?</FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Form>
    );
}
