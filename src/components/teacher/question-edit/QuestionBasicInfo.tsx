import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface QuestionBasicInfoProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData: (data: any) => void;
    categories: string[];
    newCategory: string;
    setNewCategory: (val: string) => void;
    onCreateCategory: () => void;
    isCreatingCategory?: boolean;
}

const difficulties = [
    { value: 'asan', label: 'Asan' },
    { value: 'orta', label: 'Orta' },
    { value: 'çətin', label: 'Çətin' },
];

const bloomLevels = [
    { value: 'xatırlama', label: 'Xatırlama' },
    { value: 'anlama', label: 'Anlama' },
    { value: 'tətbiq', label: 'Tətbiq' },
    { value: 'analiz', label: 'Analiz' },
    { value: 'qiymətləndirmə', label: 'Qiymətləndirmə' },
    { value: 'yaratma', label: 'Yaratma' },
];

export function QuestionBasicInfo({
    formData,
    setFormData,
    categories,
    newCategory,
    setNewCategory,
    onCreateCategory,
    isCreatingCategory
}: QuestionBasicInfoProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Başlıq</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Sual başlığı"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="weight">Ağırlıq (Xal)</Label>
                        <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 1 })}
                        />
                    </div>
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="time_limit">Zaman Limit (San)</Label>
                        <Input
                            id="time_limit"
                            type="number"
                            value={formData.time_limit}
                            onChange={(e) => setFormData({ ...formData, time_limit: parseInt(e.target.value) || '' })}
                            placeholder="Məs. 60"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Çətinlik *</Label>
                    <Select
                        value={formData.difficulty}
                        onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {difficulties.map((diff) => (
                                <SelectItem key={diff.value} value={diff.value}>
                                    {diff.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Bloom Səviyyəsi</Label>
                    <Select
                        value={formData.bloom_level || 'none'}
                        onValueChange={(value) => setFormData({ ...formData, bloom_level: value === 'none' ? '' : value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Səviyyə seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Təyin edilməyib</SelectItem>
                            {bloomLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label>Kateqoriya</Label>
                    <Select
                        value={formData.category || 'none'}
                        onValueChange={(value) => setFormData({ ...formData, category: value === 'none' ? '' : value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Kateqoriya seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Kateqoriyasız</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2 mt-1">
                        <Input
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Yeni kateqoriya"
                            className="h-8 text-sm"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8"
                            disabled={isCreatingCategory}
                            onClick={onCreateCategory}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
