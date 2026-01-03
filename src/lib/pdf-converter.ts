import { jsPDF } from 'jspdf';
import type { FileItem } from '../types';

export const convertToPdf = async (items: FileItem[]): Promise<Blob> => {
    // Initialize PDF
    // Default A4
    const doc = new jsPDF();

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const file = item.file;

        if (i > 0) {
            doc.addPage();
        }

        if (file.type.startsWith('image/')) {
            // Load image data
            const imageData = await readFileAsDataURL(file);

            // Calculate aspect ratio to fit page
            const imgProps = await getImageProperties(imageData);
            const ratio = Math.min(width / imgProps.width, height / imgProps.height);
            const imgW = imgProps.width * ratio;
            const imgH = imgProps.height * ratio;

            // Center image
            const x = (width - imgW) / 2;
            const y = (height - imgH) / 2;

            doc.addImage(imageData, file.type.split('/')[1].toUpperCase(), x, y, imgW, imgH);
        } else if (file.type === 'text/plain') {
            const text = await readFileAsText(file);
            doc.setFontSize(10);
            const splitText = doc.splitTextToSize(text, width - 20); // 10px margin each side

            // Handle pagination if text is too long
            let cursorY = 10;
            const lineHeight = 5;
            const pageHeight = doc.internal.pageSize.getHeight();

            for (let line of splitText) {
                if (cursorY + lineHeight > pageHeight - 10) {
                    doc.addPage();
                    cursorY = 10;
                }
                doc.text(line, 10, cursorY);
                cursorY += lineHeight;
            }
        } else {
            // Fallback for unknown
            doc.text(`File: ${file.name} (Preview not available)`, 10, 10);
        }
    }

    return doc.output('blob');
};

// Helpers
const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

// Helpers
const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const getImageProperties = (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = url;
    });
};
