import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
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

interface QuizMetadataFormProps {
    form: UseFormReturn<QuizMetadataFormData>;
    isEditMode: boolean;
}

export function QuizMetadataForm({ form, isEditMode }: QuizMetadataFormProps) {
    return (
        <Form {...form}>
            <div className="mb-8 rounded-2xl bg-gradient-card border border-border/50 p-6">
                <h2 className="mb-6 font-display text-xl font-bold text-foreground">
                    {isEditMode ? 'Quiz Redaktəsi' : 'Quiz Məlumatları'}
                </h2>
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

                    <FormField
                        control={form.control}
                        name="is_public"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-4">
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div>
                                    <FormLabel className="cursor-pointer">İctimai Quiz</FormLabel>
                                    <p className="text-xs text-muted-foreground">Bütün tələbələr bu quizə daxil ola bilər</p>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </Form>
    );
}
