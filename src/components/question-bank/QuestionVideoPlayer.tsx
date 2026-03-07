import { useState, useEffect } from 'react';

interface Props {
    videoUrl: string;       // YouTube URL
    startTime?: number;     // saniyə
    endTime?: number;       // saniyə
    onClipEnded?: () => void;
}

export function QuestionVideoPlayer({ videoUrl, startTime, endTime, onClipEnded }: Props) {
    const [videoId, setVideoId] = useState<string | null>(null);

    useEffect(() => {
        // YouTube URL parsing
        try {
            const url = new URL(videoUrl);
            if (url.hostname.includes('youtube.com')) {
                setVideoId(url.searchParams.get('v'));
            } else if (url.hostname.includes('youtu.be')) {
                setVideoId(url.pathname.slice(1));
            }
        } catch (e) {
            console.error("Invalid YouTube URL", e);
        }
    }, [videoUrl]);

    if (!videoId) return <div className="p-4 bg-red-100 text-red-600 rounded">Invalid Video URL</div>;

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
