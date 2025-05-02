import axios from "axios";

export const fixMenuItems = async (ocrResult) => {
    try {
        const response = await axios.post("/api/genai/fix", ocrResult);

        return response.data.data;
    } catch (error) {
        console.error("Error processing menu items:", error);
        return {
            menuItems: [],
            error: "Failed to process menu items",
            timestamp: new Date().toISOString(),
        };
    }
};
