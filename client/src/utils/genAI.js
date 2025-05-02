import axios from "axios";

export const fixMenuItems = async (ocrResult) => {
    try {
        const response = await axios.post("/api/genai/fix", ocrResult);

        return response;
    } catch (error) {
        console.error("Error processing menu items:", error);
        return {
            menuItems: [],
            error: "Failed to process menu items",
            timestamp: new Date().toISOString(),
        };
    }
};

export const textToFoodItems = async (text) => {
    try {
        const data = { text: text };
        const response = await axios.post("/api/genai/text", data);
        return { success: true, menuItems: response.data.data };
    } catch (error) {
        console.error("Error processing text to food items:", error);
        return {
            success: false,
            menuItems: [],
        };
    }
};
