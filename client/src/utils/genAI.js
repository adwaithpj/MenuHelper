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

// This function helps get a reliable food image from multiple sources
export const getFallbackFoodImage = (dishName, attemptedUrl) => {
    // Don't retry if we're already using a fallback
    if (attemptedUrl.includes("via.placeholder.com")) {
        return "https://via.placeholder.com/400x300?text=No+Image+Available";
    }

    // Try different reliable sources
    const sources = [
        // Unsplash - high quality food photos
        `https://source.unsplash.com/featured/?${encodeURIComponent(
            dishName
        )}-food`,
        // Foodish API
        `https://foodish-api.com/images/${dishName
            .toLowerCase()
            .replace(/\s+/g, "")}/random`,
        // Pexels (as a proxy through a service)
        `https://loremflickr.com/400/300/${encodeURIComponent(dishName)}/food`,
        // Placeholder as last resort
        "https://via.placeholder.com/400x300?text=Food+Image",
    ];

    // If the attempted URL is in our sources list, try the next one
    const currentIndex = sources.indexOf(attemptedUrl);
    if (currentIndex !== -1 && currentIndex < sources.length - 1) {
        return sources[currentIndex + 1];
    }

    // If not found or not from our sources, start with the first source
    return sources[0];
};
