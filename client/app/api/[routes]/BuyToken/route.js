import Web3Service from "@/components/services/Web3Service";

const Web3 = new Web3Service();

export const POST = async (req) => {
    try {
        const body = await req.json();
        const { propertyToken, offerId, numTokens, paymentAmount } = body;

        // Validate required parameters
        if (!propertyToken || !offerId || !numTokens || !paymentAmount) {
            return new Response(JSON.stringify({
                success: false,
                error: "Missing required parameters",
                required: ["propertyToken", "offerId", "numTokens", "paymentAmount"],
                timestamp: new Date().toISOString()
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Initialize Web3 service
        await Web3.init();

        // Buy tokens
        const txHash = await Web3.buyTokens(propertyToken, offerId, numTokens, paymentAmount);

        return new Response(JSON.stringify({
            success: true,
            data: {
                transactionHash: txHash,
                propertyToken,
                offerId,
                numTokens,
                paymentAmount,
                message: "Tokens purchased successfully"
            },
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("BuyToken API Error:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "Failed to buy tokens",
            message: error.message,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const GET = async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const offerId = searchParams.get('offerId');

        if (!offerId) {
            return new Response(JSON.stringify({
                success: false,
                error: "Missing offerId parameter",
                timestamp: new Date().toISOString()
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Initialize Web3 service
        await Web3.init();

        // Get offer details
        const offerDetails = await Web3.getSellOffer(offerId);

        return new Response(JSON.stringify({
            success: true,
            data: offerDetails,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("GetOffer API Error:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "Failed to get offer details",
            message: error.message,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};