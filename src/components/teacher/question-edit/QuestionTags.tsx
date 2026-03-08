import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface QuestionTagsProps {
    tags: string[];
    onChange: (tags: string[]) => void;
}

export function QuestionTags({ tags, onChange }: QuestionTagsProps) {
    const [newTag, setNewTag] = useState('');

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            onChange([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const removeTag = (tag: string) => {
        onChange(tags.filter((t) => t !== tag));
    };

    return (
        <div className="space-y-2">
            <Label>Etiketlər</Label>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md text-sm"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-destructive"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Yeni etiket"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
