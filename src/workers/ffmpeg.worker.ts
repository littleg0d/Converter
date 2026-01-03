import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import type { ConvertPayload, WorkerMessage, WorkerResponse } from '../types';

const ffmpeg = new FFmpeg();

const BASE_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

let isLoaded = false;

const loadFFmpeg = async () => {
    if (isLoaded) return;

    try {
        await ffmpeg.load({
            coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        isLoaded = true;
        postMessage({ type: 'ready' } as WorkerResponse);
    } catch (error) {
        console.error('Failed to load FFmpeg', error);
        postMessage({ type: 'error', payload: 'Failed to load FFmpeg core' } as WorkerResponse);
    }
};

const convertVideo = async (file: File, targetFormat: string = 'gif', fps = 10, scale = 1.0) => {
    if (!isLoaded) {
        await loadFFmpeg();
    }

    try {
        const inputName = `input.${file.name.split('.').pop()}`;
        const outputName = `output.${targetFormat}`;

        await ffmpeg.writeFile(inputName, await fetchFile(file));

        // Progress handler
        ffmpeg.on('progress', ({ progress }) => {
            postMessage({ type: 'progress', payload: progress } as WorkerResponse);
        });

        // Determine FFmpeg commands based on format
        let args: string[] = [];
        let mimeType = '';

        // Common filter: scale
        // scale=iw*<scale>:-2 ensures height is even (needed for some codecs)
        const scaleFilter = `scale=iw*${scale}:-2`;

        if (targetFormat === 'gif') {
            args = ['-i', inputName, '-vf', `fps=${fps},${scaleFilter}:flags=lanczos`, '-f', 'gif', outputName];
            mimeType = 'image/gif';
        } else if (targetFormat === 'mp4') {
            args = ['-i', inputName, '-vf', scaleFilter, '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', outputName];
            mimeType = 'video/mp4';
        } else if (targetFormat === 'webm') {
            args = ['-i', inputName, '-vf', scaleFilter, '-c:v', 'libvpx-vp9', '-b:v', '1M', outputName];
            mimeType = 'video/webm';
        } else {
            // Fallback generic
            args = ['-i', inputName, outputName];
            mimeType = `video/${targetFormat}`;
        }

        await ffmpeg.exec(args);

        const data = await ffmpeg.readFile(outputName);
        const blob = new Blob([data as unknown as BlobPart], { type: mimeType });

        postMessage({ type: 'done', payload: blob } as WorkerResponse);

        // Cleanup
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);

    } catch (error) {
        console.error('Conversion failed', error);
        postMessage({ type: 'error', payload: (error as Error).message } as WorkerResponse);
    }
};

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
    const { type, payload } = e.data;

    switch (type) {
        case 'load':
            await loadFFmpeg();
            break;
        case 'convert':
            if (payload) {
                const { file, targetFormat, fps, scale } = payload as ConvertPayload;
                await convertVideo(file, targetFormat, fps, scale);
            }
            break;
        default:
            console.warn('Unknown message type', type);
    }
};
