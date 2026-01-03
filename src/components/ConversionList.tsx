import { useConversionStore } from '../store/conversionStore';
import { ConversionItem } from './ConversionItem';
import { AnimatePresence } from 'framer-motion';
import { useVideoConverter } from '../hooks/useVideoConverter';
import { convertImageToWebP } from '../lib/image-converter';
import { convertToPdf } from '../lib/pdf-converter';

import { useBgRemoval } from '../hooks/useBgRemoval';

export const ConversionList = () => {
    const { files, removeFile, updateFileStatus, updateFileProgress, setFileOutput, updateFileFormat, updateFileSettings } = useConversionStore();
    const { convertVideo } = useVideoConverter();
    const { removeBackground } = useBgRemoval();

    // Handlers
    const handleConvert = async (id: string) => {
        const item = files.find(f => f.id === id);
        if (!item) return;

        try {
            updateFileStatus(id, 'converting');
            updateFileProgress(id, 0.1);

            const settings = item.conversionSettings || { quality: 0.8, scale: 1, fps: 10 };

            if (item.file.type.startsWith('image/')) {
                // Calculate target size in MB transparently
                let targetSizeMB = settings.targetSize;
                if (settings.targetSize && settings.targetSize > 0) {
                    if (settings.targetSizeUnit === 'KB') {
                        targetSizeMB = settings.targetSize / 1024;
                    }

                    // Safeguard: Prevent absurdly small sizes (e.g. < 5KB)
                    // 0.005 MB = ~5KB
                    if (targetSizeMB! < 0.005) {
                        throw new Error(`Target size is too small (${Math.round(targetSizeMB! * 1024)}KB). Minimum is 5KB.`);
                    }
                }

                // 0. Background Removal (Experimental)
                let sourceFile: File | Blob = item.file;
                if (item.outputFormat === 'png' && settings.removeBackground) {
                    updateFileProgress(id, 0.2); // Advance progress for bg removal start
                    // We treat the bg removal result as the new source for the standard pipeline
                    // This allows subsequent resizing/quality logic to still apply (though quality is less relevant for PNG)
                    sourceFile = await removeBackground(item.file, id);
                    updateFileProgress(id, 0.6); // Jump progress after BG removal (it's the heavy part)
                }

                // 1. Convert Format / Resize / Optimize
                const blob = await convertImageToWebP(
                    sourceFile as File, // Function accepts Blob/File usually, checks implementation
                    item.outputFormat as 'webp' | 'png' | 'jpg',
                    settings.quality,
                    settings.scale, // Fallback scale
                    settings.width,
                    settings.height,
                    targetSizeMB
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
                updateFileProgress(id, 0.8);
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
