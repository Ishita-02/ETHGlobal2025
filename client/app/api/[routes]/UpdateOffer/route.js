import Web3Service from "@/components/services/Web3Service";

const Web3 = new Web3Service();

export const POST = async (req) => {
    try {
        const body = await req.json();
        const { offerId, newPrice } = body;

        // Validate required parameters
        if (!offerId || !newPrice) {
            return new Response(JSON.stringify({
                success: false,
                error: "Missing required parameters",
                required: ["offerId", "newPrice"],
                timestamp: new Date().toISOString()
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Initialize Web3 service
        await Web3.init();

        // Update offer price
        const txHash = await Web3.updateOfferPrice(offerId, newPrice);

        return new Response(JSON.stringify({
            success: true,
            data: {
                transactionHash: txHash,
                offerId,
                newPrice,
                message: "Offer price updated successfully"
            },
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("UpdateOffer API Error:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "Failed to update offer price",
            message: error.message,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
