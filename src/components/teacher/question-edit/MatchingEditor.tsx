import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface MatchingPair {
    left: string;
    right: string;
}

interface MatchingEditorProps {
    pairs: MatchingPair[];
    onChange: (pairs: MatchingPair[]) => void;
}

export function MatchingEditor({ pairs, onChange }: MatchingEditorProps) {
    const safePairs = pairs && pairs.length > 0 ? pairs : [{ left: '', right: '' }];

    const updatePair = (index: number, side: 'left' | 'right', value: string) => {
        const newPairs = [...safePairs];
        newPairs[index] = { ...newPairs[index], [side]: value };
        onChange(newPairs);
    };

    const addPair = () => {
        onChange([...safePairs, { left: '', right: '' }]);
    };

    const removePair = (index: number) => {
        if (safePairs.length <= 1) return;
        onChange(safePairs.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4 rounded-lg border border-border/50 p-4 bg-muted/20">
            <Label className="text-sm font-semibold">Uyğunlaşdırma Cütləri</Label>
            <div className="space-y-3">
                {safePairs.map((pair, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                            <Input
                                value={pair.left}
                                onChange={(e) => updatePair(index, 'left', e.target.value)}
                                placeholder="Sol tərəf"
                                className="h-9"
                            />
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1">
                            <Input
                                value={pair.right}
                                onChange={(e) => updatePair(index, 'right', e.target.value)}
                                placeholder="Sağ tərəf"
                                className="h-9"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removePair(index)}
                            disabled={safePairs.length <= 1}
                            className="h-9 w-9 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPair}
                className="mt-2 w-full gap-2 border-dashed bg-transparent"
            >
                <Plus className="h-4 w-4" />
                Yeni cüt əlavə et
            </Button>
        </div>
    );
}
