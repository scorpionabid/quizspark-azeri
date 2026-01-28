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
    isSubmitting: boolean;
}

export function LoginForm({ onSubmit, isSubmitting }: LoginFormProps) {
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
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

                <motion.div variants={item} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Bəni xatırla
                        </label>
                    </div>
                    <Button variant="link" className="px-0 font-normal h-auto" type="button">
                        Parolu unutmusunuz?
                    </Button>
                </motion.div>

                <motion.div variants={item}>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Gözləyin...
                            </>
                        ) : (
                            'Daxil ol'
                        )}
                    </Button>
                </motion.div>
            </motion.form>
        </Form>
    );
}
