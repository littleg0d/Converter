import { useRef, useEffect } from 'react';
import { useConversionStore } from '../store/conversionStore';
import type { WorkerResponse } from '../types';

export const useVideoConverter = () => {
    const workerRef = useRef<Worker | null>(null);
    const { updateFileStatus, updateFileProgress, setFileOutput } = useConversionStore();

    useEffect(() => {
        // Initialize worker
        workerRef.current = new Worker(new URL('../workers/ffmpeg.worker.ts', import.meta.url), {
            type: 'module',
        });

        workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
            const { type, payload } = event.data;
            console.log('Worker Message:', type, payload);
        };

        // Load ffmpeg core
        workerRef.current.postMessage({ type: 'load' });

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const convertVideo = (fileId: string, file: File, format: 'gif' | 'mp4' | 'webm', options: { fps?: number; scale?: number } = {}) => {
        if (!workerRef.current) return;

        updateFileStatus(fileId, 'converting');
        updateFileProgress(fileId, 0);

        const handler = (event: MessageEvent<WorkerResponse>) => {
            const { type, payload } = event.data;

            if (type === 'progress') {
                updateFileProgress(fileId, payload);
            } else if (type === 'done') {
                const url = URL.createObjectURL(payload);
                setFileOutput(fileId, payload, url);
                updateFileStatus(fileId, 'completed');
                workerRef.current?.removeEventListener('message', handler);
            } else if (type === 'error') {
                updateFileStatus(fileId, 'error', payload);
                workerRef.current?.removeEventListener('message', handler);
            }
        };

        workerRef.current.addEventListener('message', handler);

        workerRef.current.postMessage({
            type: 'convert',
            payload: { file, targetFormat: format, fps: options.fps || 10, scale: options.scale || 1.0 },
        });
    };

    return { convertVideo };
};
