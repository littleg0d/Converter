export type ConversionStatus = 'pending' | 'converting' | 'completed' | 'error';

export interface FileItem {
    id: string;
    file: File;
    status: ConversionStatus;
    progress: number;
    outputBlob?: Blob;
    outputUrl?: string;
    outputFormat: 'webp' | 'png' | 'jpg' | 'gif' | 'mp4' | 'webm' | 'pdf';
    conversionSettings?: {
        quality: number; // 0-1
        scale?: number; // Deprecated in UI but keeping for compatibility if needed or removed
        width?: number; // In pixels
        height?: number; // In pixels
        fps?: number;
        targetSize?: number; // In selected unit
        targetSizeUnit?: 'MB' | 'KB';
    };
    error?: string;
}

export interface WorkerMessage {
    type: 'load' | 'convert';
    payload?: any;
}

export interface WorkerResponse {
    type: 'ready' | 'progress' | 'done' | 'error';
    payload?: any;
}

export interface ConvertPayload {
    file: File;
    targetFormat: string;
    fps?: number;
    scale?: number;
}
