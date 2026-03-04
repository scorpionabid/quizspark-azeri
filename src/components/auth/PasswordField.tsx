import { useState, InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface PasswordFieldProps {
    field: InputHTMLAttributes<HTMLInputElement>;
    label: string;
    placeholder?: string;
    autoComplete?: string;
}

export function PasswordField({ field, label, placeholder = "••••••••", autoComplete }: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-foreground">{label}</FormLabel>
            <FormControl>
                <div className="relative group">
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        className="pr-12 bg-background border-input focus:ring-primary focus:border-primary transition-all duration-200"
                        {...field}
                    />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowPassword(!showPassword);
                        }}
                        className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors focus:outline-none z-20 group-hover:text-primary/80"
                        tabIndex={-1}
                        title={showPassword ? "Parolu gizlə" : "Parolu göstər"}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 stroke-[2px]" />
                        ) : (
                            <Eye className="h-5 w-5 stroke-[2px]" />
                        )}
                    </button>
                    {/* Overlay to ensure the button is always clickable and visible */}
                    <div className="absolute inset-y-0 right-0 w-10 pointer-events-none bg-gradient-to-l from-background/50 to-transparent rounded-r-md" />
                </div>
            </FormControl>
            <FormMessage className="text-xs font-medium text-destructive" />
        </FormItem>
    );
}
