import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { PasswordField } from './PasswordField';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GraduationCap, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignupFormProps {
    onSubmit: (data: SignupFormData) => Promise<void>;
    isSubmitting: boolean;
}

export function SignupForm({ onSubmit, isSubmitting }: SignupFormProps) {
    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            role: 'student',
            password: '',
            confirmPassword: '',
        },
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <Form {...form}>
            <motion.form
                variants={container}
                initial="hidden"
                animate="show"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <motion.div variants={item}>
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-base">Mən ...</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroupItem value="student" className="sr-only" />
                                            </FormControl>
                                            <FormLabel className={cn(
                                                "flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200",
                                                field.value === "student" && "border-primary bg-primary/5 ring-1 ring-primary"
                                            )}>
                                                <User className={cn("mb-3 h-6 w-6", field.value === "student" ? "text-primary" : "text-muted-foreground")} />
                                                <span className={cn("text-sm font-semibold", field.value === "student" ? "text-primary" : "text-muted-foreground")}>
                                                    Şagirdəm
                                                </span>
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroupItem value="teacher" className="sr-only" />
                                            </FormControl>
                                            <FormLabel className={cn(
                                                "flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200",
                                                field.value === "teacher" && "border-primary bg-primary/5 ring-1 ring-primary"
                                            )}>
                                                <GraduationCap className={cn("mb-3 h-6 w-6", field.value === "teacher" ? "text-primary" : "text-muted-foreground")} />
                                                <span className={cn("text-sm font-semibold", field.value === "teacher" ? "text-primary" : "text-muted-foreground")}>
                                                    Müəlliməm
                                                </span>
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ad Soyad</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Adınız Soyadınız"
                                        autoComplete="name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </motion.div>

                <motion.div variants={item}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="email@example.com"
                                        autoComplete="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </motion.div>

                <motion.div variants={item}>
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefon nömrəsi</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="+994 (__) ___-__-__"
                                        autoComplete="tel"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </motion.div>

                <motion.div variants={item}>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <PasswordField
                                field={field}
                                label="Parol"
                                autoComplete="new-password"
                            />
                        )}
                    />
                </motion.div>

                <motion.div variants={item}>
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <PasswordField
                                field={field}
                                label="Parolu təsdiqlə"
                                autoComplete="new-password"
                            />
                        )}
                    />
                </motion.div>

                <motion.div variants={item}>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Gözləyin...
                            </>
                        ) : (
                            'Qeydiyyatdan keç'
                        )}
                    </Button>
                </motion.div>
            </motion.form>
        </Form>
    );
}
