import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { PasswordField } from './PasswordField';
import { motion } from 'framer-motion';

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    onForgotPassword: (email: string) => Promise<void>;
    isSubmitting: boolean;
}

export function LoginForm({ onSubmit, onForgotPassword, isSubmitting }: LoginFormProps) {
    const [isForgotMode, setIsForgotMode] = useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: localStorage.getItem('remembered_email') || '',
            password: '',
            rememberMe: !!localStorage.getItem('remembered_email'),
        },
    });

    // If user changes forgot mode, reset password but keep email
    useEffect(() => {
        if (isForgotMode) {
            form.setValue('password', '');
        }
    }, [isForgotMode, form]);

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
                className="space-y-4"
            >
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

                {!isForgotMode && (
                    <motion.div variants={item}>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <PasswordField
                                    field={field}
                                    label="Parol"
                                    autoComplete="current-password"
                                />
                            )}
                        />
                    </motion.div>
                )}

                {!isForgotMode && (
                    <motion.div variants={item} className="flex items-center justify-between">
                        <FormField
                            control={form.control}
                            name="rememberMe"
                            render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox
                                            id="remember"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <label
                                        htmlFor="remember"
                                        className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Məni xatırla
                                    </label>
                                </div>
                            )}
                        />
                        <Button variant="link" className="px-0 font-normal h-auto" type="button" onClick={() => setIsForgotMode(true)}>
                            Parolu unutmusunuz?
                        </Button>
                    </motion.div>
                )}

                {isForgotMode && (
                    <motion.div variants={item} className="flex justify-end">
                        <Button
                            variant="link"
                            className="px-0 font-normal h-auto text-primary"
                            type="button"
                            onClick={() => setIsForgotMode(false)}
                        >
                            Geri Qayıt
                        </Button>
                    </motion.div>
                )}

                <motion.div variants={item}>
                    <Button
                        type="submit"
                        className="w-full h-11 text-base transition-all duration-200"
                        disabled={isSubmitting}
                        onClick={isForgotMode ? (e) => {
                            e.preventDefault();
                            onForgotPassword(form.getValues('email'));
                        } : undefined}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Gözləyin...
                            </>
                        ) : (
                            isForgotMode ? 'Sıfırlama linkini göndər' : 'Daxil ol'
                        )}
                    </Button>
                </motion.div>
            </motion.form>
        </Form>
    );
}
