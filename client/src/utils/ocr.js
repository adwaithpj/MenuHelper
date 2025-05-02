import { createWorker } from "tesseract.js";

const convertor = async (img) => {
    try {
        const worker = await createWorker({
            // logger: (m) => console.log(m), // Optional: for debugging
            errorHandler: (err) => {
                console.error("Tesseract Worker Error:", err);
            },
        });
        await worker.loadLanguage("eng");
        await worker.initialize("eng");

        const {
            data: { text },
        } = await worker.recognize(img);
        await worker.terminate();

        return text.trim();
    } catch (error) {
        console.error("OCR Error:", error);
        throw new Error("Failed to process image with OCR");
    }
};

export default convertor;
