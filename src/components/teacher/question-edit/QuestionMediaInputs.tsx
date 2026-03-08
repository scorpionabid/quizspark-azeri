import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface QuestionMediaInputsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData: (data: any) => void;
    onImageUpload: (file: File) => Promise<void>;
    isUploading: boolean;
    on3DUpload: (file: File) => Promise<void>;
    is3DUploading: boolean;
}

export function QuestionMediaInputs({
    formData,
    setFormData,
    onImageUpload,
    isUploading,
    on3DUpload,
    is3DUploading
}: QuestionMediaInputsProps) {
    return (
        <div className="space-y-6 pt-4 border-t">
            <Label className="text-base font-semibold">Media & Şəkil</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Question Image */}
                <div className="space-y-2">
                    <Label htmlFor="question_image">Sual Şəkli (Yüklə)</Label>
                    {formData.question_image_url && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border mb-2 bg-muted/30">
                            <img src={formData.question_image_url} alt="Sual şəkli" className="w-full h-full object-contain" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6"
                                onClick={() => setFormData({ ...formData, question_image_url: '' })}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Input
                            id="question_image"
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) await onImageUpload(file);
                            }}
                            disabled={isUploading}
                            className="cursor-pointer"
                        />
                        {isUploading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    </div>
                </div>

                {/* Other Media */}
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label>Media Tipi</Label>
                        <Select
                            value={formData.media_type || 'none'}
                            onValueChange={(value) => setFormData({ ...formData, media_type: value === 'none' ? null : value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Media tipi seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Yoxdur</SelectItem>
                                <SelectItem value="image">Şəkil (URL)</SelectItem>
                                <SelectItem value="audio">Audio</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {formData.media_type && (
                        <div className="space-y-2">
                            <Label htmlFor="media_url">Media URL</Label>
                            <Input
                                id="media_url"
                                value={formData.media_url}
                                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Video Specific */}
            {formData.question_type === 'video' && (
                <div className="space-y-4 border rounded p-4 bg-muted/20">
                    <Label className="font-semibold">Video Ayarları</Label>
                    <Input
                        value={formData.video_url}
                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                        placeholder="YouTube Video URL"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="number"
                            value={formData.video_start_time}
                            onChange={(e) => setFormData({ ...formData, video_start_time: e.target.value })}
                            placeholder="Start Time (San)"
                        />
                        <Input
                            type="number"
                            value={formData.video_end_time}
                            onChange={(e) => setFormData({ ...formData, video_end_time: e.target.value })}
                            placeholder="End Time (San)"
                        />
                    </div>
                </div>
            )}

            {/* 3D Model Specific */}
            {formData.question_type === 'model_3d' && (
                <div className="space-y-4 border rounded p-4 bg-muted/20">
                    <Label className="font-semibold">3D Model Ayarları (.glb / .gltf)</Label>
                    <Input
                        value={formData.model_3d_url}
                        onChange={(e) => setFormData({ ...formData, model_3d_url: e.target.value })}
                        placeholder="3D Model URL yüklə və ya yapışdır"
                    />
                    <div className="flex items-center gap-2">
                        <Input
                            type="file"
                            accept=".glb,.gltf"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) await on3DUpload(file);
                            }}
                            disabled={is3DUploading}
                        />
                        {is3DUploading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    </div>
                </div>
            )}
        </div>
    );
}
