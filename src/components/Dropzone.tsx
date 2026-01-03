import { useState, useCallback, useRef } from 'react';
import { Upload, FileType, Image as ImageIcon, Film } from 'lucide-react';
import { useConversionStore } from '../store/conversionStore';
import type { FileItem } from '../types';

export const Dropzone = () => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const addFiles = useConversionStore((state) => state.addFiles);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processFiles = useCallback((files: FileList | null) => {
        if (!files) return;

        const newFiles: FileItem[] = Array.from(files).map((file) => ({
            id: crypto.randomUUID(),
            file,
            status: 'pending',
            progress: 0,
            outputFormat: file.type.startsWith('video/')
                ? 'gif'
                : file.type.startsWith('image/')
                    ? 'webp'
                    : 'pdf', // Default for text/pdf
        }));

        addFiles(newFiles);
    }, [addFiles]);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            processFiles(e.dataTransfer.files);
        },
        [processFiles]
    );

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            processFiles(e.target.files);
        },
        [processFiles]
    );

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
        relative w-full max-w-2xl mx-auto h-40 md:h-56 border-2 border-dashed rounded-2xl md:rounded-3xl
        flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        backdrop-blur-sm
        ${isDragging
                    ? 'border-violet-500 bg-violet-500/10 scale-[1.02] shadow-[0_0_40px_rgba(139,92,246,0.3)]'
                    : 'border-white/10 bg-white/5 hover:border-violet-500/40 hover:bg-white/10 hover:shadow-lg hover:shadow-violet-500/5'
                }
      `}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept="image/*,video/*,.pdf,.txt"
            />

            <div className={`p-3 rounded-full mb-2 md:mb-3 transition-all duration-300 ${isDragging ? 'bg-violet-500/20 shadow-inner' : 'bg-white/5'}`}>
                <Upload className={`w-5 h-5 md:w-6 md:h-6 text-violet-400 ${isDragging ? 'animate-bounce' : ''}`} />
            </div>

            <h3 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 text-center px-4">
                <span className="md:hidden">Tap to add files</span>
                <span className="hidden md:block">Drop files here to process locally</span>
            </h3>
            <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-400 font-medium text-center px-4">
                <span className="md:hidden">Images, Video, Docs</span>
                <span className="hidden md:block">Supports JPG, PNG, WebP, MP4, MOV, WebM, PDF, TXT</span>
            </p>

            <div className="flex gap-4 md:gap-6 mt-4 md:mt-8 text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest opacity-60">
                <span className="flex items-center gap-1.5 md:gap-2">
                    <ImageIcon className="w-3 h-3" /> Images
                </span>
                <span className="flex items-center gap-1.5 md:gap-2">
                    <Film className="w-3 h-3" /> Video
                </span>
                <span className="flex items-center gap-1.5 md:gap-2">
                    <FileType className="w-3 h-3" /> Docs
                </span>
            </div>
        </div>
    );
};
