
import { useEffect, useRef, useCallback } from 'react';

export const useBgRemoval = () => {
    const workerRef = useRef<Worker | null>(null);

    const initWorker = useCallback(() => {
        if (!workerRef.current) {
            workerRef.current = new Worker(new URL('../workers/bg-removal.worker.ts', import.meta.url), {
                type: 'module'
            });
        }
    }, []);

    const removeBackground = useCallback((file: File, id: string): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            initWorker();
            const worker = workerRef.current!;

            const handler = (event: MessageEvent) => {
                const { status, id: msgId, result, error } = event.data;

                if (msgId !== id) return;

                if (status === 'model-progress') {
                    // console.log('Model loading progress:', event.data.progress);
                } else if (status === 'processing') {
                    // Processing started
                } else if (status === 'complete') {
                    if (result instanceof Blob) {
                        resolve(result);
                    } else {
                        reject(new Error("Worker returned invalid result"));
                    }
                    worker.removeEventListener('message', handler);
                } else if (status === 'error') {
                    reject(new Error(error));
                    worker.removeEventListener('message', handler);
                }
            };

            worker.addEventListener('message', handler);

            // Send invalidation/processing request
            worker.postMessage({
                id,
                image: file
            });
        });
    }, [initWorker]);

    useEffect(() => {
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    return { removeBackground };
};
