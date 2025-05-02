import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const foodItemSchema = z.object({
    dishName: z.string().min(1, "Dish name is required"),
    description: z.string().min(1, "Description is required"),
    imageUrl: z.string().url("Valid image URL is required"),
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
    try {
        const { text } = await request.json();
        if (!text) {
            return Response.json(
                {
                    status: 400,
                    success: false,
                    reason: "No text provided",
                    data: null,
                },
                { status: 400 }
            );
        }

        const prompt = `You are a professional food advisor. Your role is to provide a short description of the food item or items the user is asking for.
        The description should be short, it should tell about the taste, spiciness, health benefits, and calories.

        Give a image of the food item(s) in the response.

        IMPORTANT: Return ONLY the JSON object, without any markdown formatting, code blocks, or additional text.
        Do not include \`\`\`json or any other formatting characters.

        If the text was more than one food item, return an array of food items.

        The output should be in the following format:
        {
            "dishName": "Dish Name",
            "description": "Description of the food",
            "imageUrl": "Image URL of the food"
        }

        The dish name should be the same as the dish name in the menu items.
        The image URL should be a URL of a food image.
        
        The food items are: ${text}. If there is no food item, return:
        {
            "message": "No food items found"
        }`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        // Clean the response text by removing any markdown formatting and newlines
        const cleanResponse = response.text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .replace(/\n/g, " ")
            .trim();

        let parsedResult;
        try {
            parsedResult = JSON.parse(cleanResponse);

            // Validate the response format
            if (Array.isArray(parsedResult)) {
                // If it's an array, validate each item
                const validatedItems = parsedResult
                    .map((item) => {
                        try {
                            return foodItemSchema.parse(item);
                        } catch (error) {
                            console.error("Invalid food item format:", error);
                            return null;
                        }
                    })
                    .filter(Boolean);

                return Response.json(
                    { status: 200, success: true, data: validatedItems },
                    { status: 200 }
                );
            } else if (
                typeof parsedResult === "object" &&
                parsedResult !== null
            ) {
                // If it's a single object, validate it
                try {
                    const validatedItem = foodItemSchema.parse(parsedResult);
                    return Response.json(
                        { status: 200, success: true, data: [validatedItem] },
                        { status: 200 }
                    );
                } catch (error) {
                    console.error("Invalid food item format:", error);
                    return Response.json(
                        { status: 200, success: true, data: [] },
                        { status: 200 }
                    );
                }
            } else {
                return Response.json(
                    { status: 200, success: true, data: [] },
                    { status: 200 }
                );
            }
        } catch (error) {
            console.error("Failed to parse AI response:", error);
            console.error("Raw response:", response.text);
            console.error("Cleaned response:", cleanResponse);
            return Response.json(
                {
                    success: false,
                    data: { message: "Failed to parse AI response" },
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error in text generation", error);
        return Response.json(
            {
                success: false,
                data: { message: "GenAI failed/server error" },
            },
            { status: 500 }
        );
    }
}
