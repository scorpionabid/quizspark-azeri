import '@google/model-viewer';

interface Props {
    modelUrl: string;
    alt?: string;
    autoRotate?: boolean;
}

export function Question3DViewer({ modelUrl, alt = "3D model", autoRotate = true }: Props) {
    return (
        <div className="w-full h-[400px] border rounded-md bg-white overflow-hidden flex justify-center items-center">
            <model-viewer
                src={modelUrl}
                alt={alt}
                auto-rotate={autoRotate}
                camera-controls
                ar
                style={{ width: '100%', height: '100%', backgroundColor: '#f3f4f6' }}
            >
                <div slot="poster" className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                    3D Model yüklənir...
                </div>
            </model-viewer>
        </div>
    );
}
