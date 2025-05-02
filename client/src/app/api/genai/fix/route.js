import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const menuResponseSchema = z.object({
    menuItems: z.array(z.string()).min(0),
    success: z.boolean(),
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
    try {
        const { menuItems } = await request.json();
        console.log("this is the menu items ", menuItems);
        if (!menuItems) {
            return Response.json(
                {
                    status: 400,
                    success: false,
                    reason: "No menu items provided",
                    data: null,
                },
                { status: 400 }
            );
        }

        const prompt = `You are a menu item extractor. Your task is to analyze the following menu text and extract only the dish names, maintaining their exact sequence as they appear in the original text. Do not add any items that aren't explicitly mentioned, and do not modify or clean up the dish names.

        Input text from menu:
        ${menuItems}

        IMPORTANT: Return ONLY a JSON object with two properties:
        1. menuItems: An array of strings containing the dish names
        2. success: A boolean indicating if any dish names were found (true if found, false if not)

        Example format:
        {
            "menuItems": ["Dish 1", "Dish 2", "Dish 3"],
            "success": true
        }

        If no dish names are found, return:
        {
            "menuItems": [],
            "success": false
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

        try {
            const parsedResult = JSON.parse(cleanResponse);
            const validatedResult = menuResponseSchema.parse(parsedResult);

            return Response.json(
                {
                    success: validatedResult.success,
                    data: validatedResult.menuItems,
                },
                { status: 200 }
            );
        } catch (error) {
            console.error("Failed to parse AI response:", error);
            console.error("Raw response:", response.text);
            console.error("Cleaned response:", cleanResponse);
            return Response.json(
                {
                    success: false,
                    data: [],
                    error: "Failed to parse menu items",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error processing menu items:", error);
        return Response.json(
            {
                success: false,
                data: [],
                error: "Failed to process menu items",
            },
            { status: 500 }
        );
    }
}
