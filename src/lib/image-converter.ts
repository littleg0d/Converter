export const convertImageToWebP = async (
    file: File | Blob,
    format: 'webp' | 'png' | 'jpg' = 'webp',
    quality = 0.8,
    scale = 1.0,
    width?: number,
    height?: number,
    targetSizeMB?: number
): Promise<Blob> => {
    return new Promise(async (resolve, reject) => {
        try {
            const bitmap = await createImageBitmap(file);

            // Calculate dimensions
            let finalWidth = bitmap.width;
            let finalHeight = bitmap.height;

            if (width && height) {
                finalWidth = width;
                finalHeight = height;
            } else if (width) {
                finalWidth = width;
                finalHeight = (width / bitmap.width) * bitmap.height;
            } else if (height) {
                finalHeight = height;
                finalWidth = (height / bitmap.height) * bitmap.width;
            } else if (scale !== 1) {
                finalWidth = bitmap.width * scale;
                finalHeight = bitmap.height * scale;
            }

            const canvas = document.createElement('canvas');
            canvas.width = finalWidth;
            canvas.height = finalHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(bitmap, 0, 0, finalWidth, finalHeight);

            const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;

            // If targetSizeMB is set, we ignore quality param and loop to find best fit
            if (targetSizeMB && targetSizeMB > 0) {
                const targetSizeBytes = targetSizeMB * 1024 * 1024;

                // 1. Try Max Quality First
                const maxQBlob = await new Promise<Blob | null>(r => canvas.toBlob(r, mimeType, 1.0));

                if (maxQBlob && maxQBlob.size <= targetSizeBytes) {
                    resolve(maxQBlob);
                    return;
                }

                // If format is PNG, we can't compress via quality.
                if (format === 'png') {
                    // Best effort: return the blob we have (since we can't make it smaller by quality)
                    if (maxQBlob) resolve(maxQBlob);
                    else reject(new Error('Conversion failed'));
                    return;
                }

                // 2. Binary search for quality (JPG/WebP)
                let min = 0.0, max = 1.0;
                let bestBlob: Blob | null = null;

                // Increase iterations for better precision
                for (let i = 0; i < 10; i++) {
                    const currentQ = (min + max) / 2;
                    const b = await new Promise<Blob | null>(r => canvas.toBlob(r, mimeType, currentQ));
                    if (!b) break;

                    if (b.size <= targetSizeBytes) {
                        bestBlob = b; // Candidate found
                        min = currentQ; // Try higher quality
                    } else {
                        max = currentQ; // Too big, reduce quality
                    }
                }

                // 3. Final Fallback
                if (bestBlob) {
                    resolve(bestBlob);
                } else {
                    // Even lowest quality didn't fit, or something went wrong.
                    // Return the smallest we found (likely Q ~ 0)
                    const lowQBlob = await new Promise<Blob | null>(r => canvas.toBlob(r, mimeType, 0.01));
                    if (lowQBlob) resolve(lowQBlob);
                    else reject(new Error('Conversion failed'));
                }

            } else {
                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error(`Conversion to ${format} failed`));
                    },
                    mimeType,
                    quality
                );
            }

            bitmap.close();

        } catch (error) {
            reject(error);
        }
    });
};
