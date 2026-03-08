import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NumericalEditorProps {
    value: number | string;
    tolerance: number;
    onChange: (value: number | string, tolerance: number) => void;
}

export function NumericalEditor({ value, tolerance, onChange }: NumericalEditorProps) {
    return (
        <div className="space-y-4 rounded-lg border border-border/50 p-4 bg-muted/20">
            <Label className="text-sm font-semibold">Rəqəmsal Cavab Ayarları</Label>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="num_val" className="text-xs">Düzgün Rəqəm *</Label>
                    <Input
                        id="num_val"
                        type="number"
                        value={value}
                        onChange={(e) => onChange(e.target.value, tolerance)}
                        placeholder="Məs: 42"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="num_tol" className="text-xs">Tolerantlıq (±)</Label>
                    <Input
                        id="num_tol"
                        type="number"
                        step="0.01"
                        value={tolerance}
                        onChange={(e) => onChange(value, parseFloat(e.target.value) || 0)}
                        placeholder="Məs: 0.5"
                    />
                </div>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
                Tələbənin cavabı {Number(value) - tolerance} ilə {Number(value) + tolerance} arasında olarsa düzgün sayılacaq.
            </p>
        </div>
    );
}
