import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { PasswordField } from './PasswordField';
import { motion } from 'framer-motion';

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
                className="space-y-4"
            >
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
