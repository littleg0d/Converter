import { create } from 'zustand';
import type { FileItem, ConversionStatus } from '../types';

interface GlobalSettings {
    videoFps: number;
    imageQuality: number;
}

interface ConversionState {
    files: FileItem[];
    settings: GlobalSettings;
    addFiles: (newFiles: FileItem[]) => void;
    removeFile: (id: string) => void;
    updateFileStatus: (id: string, status: ConversionStatus, error?: string) => void;
    updateFileProgress: (id: string, progress: number) => void;
    updateFileFormat: (id: string, format: FileItem['outputFormat']) => void;
    updateFileSettings: (id: string, settings: Partial<NonNullable<FileItem['conversionSettings']>>) => void;
    setFileOutput: (id: string, blob: Blob, url: string) => void;
    clearCompleted: () => void;
    updateSettings: (settings: Partial<GlobalSettings>) => void;
}

export const useConversionStore = create<ConversionState>((set) => ({
    files: [],
    settings: {
        videoFps: 10,
        imageQuality: 0.8,
    },

    addFiles: (newFiles) =>
        set((state) => ({
            files: [...state.files, ...newFiles.map(f => ({
                ...f,
                conversionSettings: {
                    quality: state.settings.imageQuality,
                    scale: 1, // Default scale
                    // width/height will be set when file loads or can be undefined to keep original
                    fps: state.settings.videoFps,
                    targetSize: 0,
                    targetSizeUnit: 'MB' as 'MB' | 'KB'
                }
            }))]
        })),

    removeFile: (id) =>
        set((state) => ({
            files: state.files.filter((f) => f.id !== id),
        })),

    updateFileStatus: (id, status, error) =>
        set((state) => ({
            files: state.files.map((f) =>
                f.id === id ? { ...f, status, error } : f
            ),
        })),

    updateFileProgress: (id, progress) =>
        set((state) => ({
            files: state.files.map((f) =>
                f.id === id ? { ...f, progress } : f
            ),
        })),

    updateFileFormat: (id, format) =>
        set((state) => ({
            files: state.files.map((f) =>
                f.id === id ? { ...f, outputFormat: format } : f
            ),
        })),

    updateFileSettings: (id, newSettings) =>
        set((state) => ({
            files: state.files.map((f) =>
                f.id === id ? {
                    ...f,
                    conversionSettings: { ...f.conversionSettings!, ...newSettings }
                } : f
            ),
        })),

    setFileOutput: (id, blob, url) =>
        set((state) => ({
            files: state.files.map((f) =>
                f.id === id ? { ...f, outputBlob: blob, outputUrl: url } : f
            ),
        })),

    clearCompleted: () =>
        set((state) => ({
            files: state.files.filter((f) => f.status !== 'completed'),
        })),

    updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),
}));
