import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface OrderingEditorProps {
    items: string[];
    onChange: (items: string[]) => void;
}

interface SortableItemProps {
    id: string;
    value: string;
    index: number;
    onUpdate: (value: string) => void;
    onRemove: () => void;
    canRemove: boolean;
}

function SortableItem({ id, value, index, onUpdate, onRemove, canRemove }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-2 bg-background border rounded-md p-1 pr-2 shadow-sm">
            <button {...attributes} {...listeners} className="p-1.5 cursor-grab hover:bg-muted rounded">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex-none w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                {index + 1}
            </div>
            <Input
                value={value}
                onChange={(e) => onUpdate(e.target.value)}
                placeholder={`Element ${index + 1}`}
                className="h-8 border-none focus-visible:ring-0 shadow-none px-1"
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                disabled={!canRemove}
                className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}

export function OrderingEditor({ items, onChange }: OrderingEditorProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = items.indexOf(active.id as string);
            const newIndex = items.indexOf(over.id as string);
            onChange(arrayMove(items, oldIndex, newIndex));
        }
    };

    const addItem = () => onChange([...items, ""]);
    const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index));
    const updateItem = (index: number, val: string) => {
        const newItems = [...items];
        newItems[index] = val;
        onChange(newItems);
    };

    return (
        <div className="space-y-4 rounded-lg border border-border/50 p-4 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold">Ardıcıllıq Elementləri</Label>
                <span className="text-[10px] text-muted-foreground italic">Düzgün sıranı təyin edin</span>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <SortableItem
                                key={item || `empty-${index}`} // Be careful with keys, if multiple empties, keys might clash.
                                id={item || `empty-${index}`}
                                value={item}
                                index={index}
                                onUpdate={(val) => updateItem(index, val)}
                                onRemove={() => removeItem(index)}
                                canRemove={items.length > 2}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="mt-2 w-full gap-2 border-dashed bg-transparent"
            >
                <Plus className="h-4 w-4" />
                Yeni element əlavə et
            </Button>
        </div>
    );
}
