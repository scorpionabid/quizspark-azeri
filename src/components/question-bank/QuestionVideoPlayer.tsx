import { useState, useEffect } from 'react';
import { Video } from 'lucide-react';

interface Props {
    videoUrl: string;       // YouTube URL
    startTime?: number;     // saniyə
    endTime?: number;       // saniyə
    onClipEnded?: () => void;
}

export function QuestionVideoPlayer({ videoUrl, startTime, endTime, onClipEnded }: Props) {
    const [videoId, setVideoId] = useState<string | null>(null);

    useEffect(() => {
        if (!videoUrl) {
            setVideoId(null);
            return;
        }

        // Improved YouTube ID extraction
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = videoUrl.match(regExp);
        const id = (match && match[2].length === 11) ? match[2] : null;

        setVideoId(id);
    }, [videoUrl]);

    if (!videoId) {
        // If it looks like a YouTube URL but we couldn't get an ID, show an error instead of trying to play it as a raw video
        const isYouTubeLikely = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

        if (isYouTubeLikely) {
            return (
                <div className="aspect-video w-full rounded-md overflow-hidden bg-muted flex flex-col justify-center items-center p-4 text-center">
                    <Video className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">YouTube videosu yüklənə bilmədi</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Zəhmət olmasa linkin düzgünlüyünü yoxlayın</p>
                </div>
            );
        }

        return (
            <div className="aspect-video w-full rounded-md overflow-hidden bg-black flex justify-center items-center">
                <video
                    src={videoUrl}
                    controls
                    className="w-full h-full"
                    onEnded={onClipEnded}
                >
                    Sizin brauzeriniz video teqini dəstəkləmir.
                </video>
            </div>
        );
    }

    const src = `https://www.youtube.com/embed/${videoId}?start=${startTime || 0}${endTime ? `&end=${endTime}` : ''}&autoplay=0&rel=0`;

    return (
        <div className="aspect-video w-full rounded-md overflow-hidden bg-black flex justify-center items-center">
            <iframe
                width="100%"
                height="100%"
                src={src}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}
