import { GoogleGenAI } from "@google/genai";

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

        Please return only the dish names in their original order, exactly as they appear in the text. Do not add descriptions, prices, or any other information.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        return Response.json({
            success: true,
            data: response.text,
        });
    } catch (error) {
        console.error("Error processing menu items:", error);
        return Response.json(
            {
                success: false,
                error: "Failed to process menu items",
            },
            { status: 500 }
        );
    }
}
