import { useConversionStore } from '../store/conversionStore';
import { ConversionItem } from './ConversionItem';
import { AnimatePresence } from 'framer-motion';
import { useVideoConverter } from '../hooks/useVideoConverter';
import { convertImageToWebP } from '../lib/image-converter';
import { convertToPdf } from '../lib/pdf-converter';

export const ConversionList = () => {
    const { files, removeFile, updateFileStatus, updateFileProgress, setFileOutput, updateFileFormat, updateFileSettings } = useConversionStore();
    const { convertVideo } = useVideoConverter();

    // Handlers
    const handleConvert = async (id: string) => {
        const item = files.find(f => f.id === id);
        if (!item) return;

        try {
            updateFileStatus(id, 'converting');
            updateFileProgress(id, 0.1);

            const settings = item.conversionSettings || { quality: 0.8, scale: 1, fps: 10 };

            if (item.file.type.startsWith('image/')) {
                // 1. Convert Format
                const blob = await convertImageToWebP(
                    item.file,
                    item.outputFormat as 'webp' | 'png' | 'jpg',
                    settings.quality,
                    settings.scale, // Fallback scale
                    settings.width,
                    settings.height,
                    settings.targetSize
                );
                const url = URL.createObjectURL(blob);

                setFileOutput(id, blob, url);
                updateFileStatus(id, 'completed');
                updateFileProgress(id, 1);

            } else if (item.file.type.startsWith('video/')) {
                // Video doesn't support width/targetSize yet in this worker implementation fully 
                // but we can pass scale if calculated.
                // For now just pass generic options.
                convertVideo(id, item.file, item.outputFormat as 'gif' | 'mp4' | 'webm', {
                    fps: settings.fps,
                    scale: settings.scale // Video worker currently expecting scale
                });
            } else {
                // PDF
                updateFileProgress(id, 0.5);
                const blob = await convertToPdf([item]);
                const url = URL.createObjectURL(blob);

                setFileOutput(id, blob, url);
                updateFileStatus(id, 'completed');
                updateFileProgress(id, 1);
            }

        } catch (err) {
            updateFileStatus(id, 'error', (err as Error).message);
        }
    };

    const handleConvertAll = () => {
        files.forEach(f => {
            if (f.status === 'pending') handleConvert(f.id);
        });
    };

    if (files.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-semibold text-gray-200">Queue ({files.length})</h3>
                {files.some(f => f.status === 'pending') && (
                    <button
                        onClick={handleConvertAll}
                        className="text-xs font-bold text-violet-400 hover:text-violet-300 uppercase tracking-wider"
                    >
                        Start All
                    </button>
                )}
            </div>

            <div className="space-y-3">
                <AnimatePresence mode='popLayout'>
                    {files.map((item) => (
                        <ConversionItem
                            key={item.id}
                            item={item}
                            onRemove={removeFile}
                            onConvert={handleConvert}
                            onFormatChange={updateFileFormat}
                            onUpdateSettings={updateFileSettings}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
