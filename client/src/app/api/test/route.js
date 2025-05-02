export async function GET(request) {
    try {
        return Response.json({
            success: true,
            data: {
                message: "Test API is working!",
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("Test API Error:", error);
        return Response.json(
            {
                success: false,
                error: "Test API failed",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
