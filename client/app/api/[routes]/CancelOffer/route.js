import Web3Service from "@/components/services/Web3Service";

const Web3 = new Web3Service();

export const POST = async (req) => {
    try {
        const body = await req.json();
        const { offerId } = body;

        // Validate required parameters
        if (!offerId) {
            return new Response(JSON.stringify({
                success: false,
                error: "Missing required parameter: offerId",
                timestamp: new Date().toISOString()
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Initialize Web3 service
        await Web3.init();

        // Cancel sell offer
        const txHash = await Web3.cancelSellOffer(offerId);

        return new Response(JSON.stringify({
            success: true,
            data: {
                transactionHash: txHash,
                offerId,
                message: "Sell offer cancelled successfully"
            },
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("CancelOffer API Error:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "Failed to cancel offer",
            message: error.message,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
