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

        const prompt = `You have a list of food items, Your role is to fetch images and a short description of the food.
        The description should be short , it should tell about the taste, spicynesss, health benefits, calories,

        With that you should also return the image url of the food.

        The output should be in the following format:
        {
            "dishName": "Dish Name",
            "description": "Description of the food",
            "imageUrl": "Image URL of the food"
        }

        The dish name should be the same as the dish name in the menu items.

        The image url should be a url of a food image.

        The food item are : ${menuItems}

        Don't add thinking logic, just return it in json format. Don't include '\ n' in the response. pUre json
        `;

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
