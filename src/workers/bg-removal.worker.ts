
import { pipeline, env } from '@huggingface/transformers';

console.log("[Worker] Strictly initializing briaai/RMBG-1.4 as requested...");

// User-specified environment configuration
env.allowLocalModels = false;
env.useBrowserCache = true;
env.remoteHost = 'https://huggingface.co/';
env.remotePathTemplate = '{model}/resolve/{revision}/';

const MODEL_ID = 'briaai/RMBG-1.4';

class BackgroundRemovalSingleton {
    static instance: any = null;

    static async getInstance(progress_callback: any) {
        if (this.instance) return this.instance;

        console.log(`[Worker] Attempting to load EXCLUSIVE model: ${MODEL_ID}`);
        try {
            this.instance = await pipeline('image-segmentation', MODEL_ID, {
                progress_callback,
                fetch_options: {
                    credentials: 'omit', // Crucial to bypass 401 on gated models
                }
            } as any);
            console.log(`[Worker] SUCCESS: Loaded ${MODEL_ID}`);
            return this.instance;
        } catch (err: any) {
            console.error(`[Worker] CRITICAL ERROR: Failed to load ${MODEL_ID}: ${err.message}`);
            throw err;
        }
    }
}

self.onmessage = async (event) => {
    const { image, id } = event.data;

    try {
        self.postMessage({ status: 'loading-model', id });

        const segmenter = await BackgroundRemovalSingleton.getInstance((data: any) => {
            if (data.status === 'progress') {
                self.postMessage({
                    status: 'model-progress',
                    id,
                    progress: data.progress
                });
            }
        });

        self.postMessage({ status: 'processing', id });

        // 1. Image context
        const sourceBitmap = await createImageBitmap(image);
        const { width, height } = sourceBitmap;

        // 2. Inference
        const output = await segmenter(image);

        // 3. Mask Extraction
        let maskRaw;
        if (Array.isArray(output)) {
            maskRaw = output[0].mask;
        } else if (output.mask) {
            maskRaw = output.mask;
        } else {
            maskRaw = output;
        }

        // 4. Alpha Refinement & Composition (RGBA)
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not get 2D context");

        const maskWidth = maskRaw.width;
        const maskHeight = maskRaw.height;
        const maskData = maskRaw.data;

        const maskImageData = new ImageData(maskWidth, maskHeight);
        for (let i = 0; i < maskData.length; ++i) {
            let val = maskData[i];

            // Binarización/Thresholding strictly for crisp logos
            if (val < 15) val = 0;
            else if (val > 240) val = 255;

            const offset = i * 4;
            maskImageData.data[offset] = 0;
            maskImageData.data[offset + 1] = 0;
            maskImageData.data[offset + 2] = 0;
            maskImageData.data[offset + 3] = val;
        }

        const maskCanvas = new OffscreenCanvas(maskWidth, maskHeight);
        const maskCtx = maskCanvas.getContext('2d');
        maskCtx?.putImageData(maskImageData, 0, 0);

        // --- FINAL COMPOSITION ---
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(sourceBitmap, 0, 0);
        ctx.globalCompositeOperation = 'destination-in';
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(maskCanvas, 0, 0, width, height);

        // 5. Send results back
        const processedBlob = await canvas.convertToBlob({ type: 'image/png' });

        console.log(`[Worker] Done with ${MODEL_ID}. Size: ${processedBlob.size}`);
        self.postMessage({ status: 'complete', id, result: processedBlob });

        sourceBitmap.close();

    } catch (error: any) {
        console.error("[Worker] Error:", error);
        self.postMessage({ status: 'error', id, error: `[IA] ${error.message}` });
    }
};
