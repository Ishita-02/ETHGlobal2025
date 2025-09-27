import Web3Service from "@/components/services/Web3Service";

const Web3 = new Web3Service();

// Get property token information
export const GET = async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const propertyToken = searchParams.get('propertyToken');
        const action = searchParams.get('action');

        if (!propertyToken) {
            return new Response(JSON.stringify({
                success: false,
                error: "Missing propertyToken parameter",
                timestamp: new Date().toISOString()
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Initialize Web3 service
        await Web3.init();

        let response = {};

        switch (action) {
            case 'getPropertyInfo':
                const propertyInfo = await Web3.getPropertyInfo(propertyToken);
                response = { propertyInfo };
                break;

            case 'getActiveOffers':
                const activeOffers = await Web3.getActiveOffers(propertyToken);
                response = { activeOffers };
                break;

            case 'getUserOffers':
                const userAddress = searchParams.get('userAddress');
                const userOffers = await Web3.getUserOffers(userAddress);
                response = { userOffers, userAddress };
                break;

            default:
                // Get all information
                try {
                    const propertyInfo = await Web3.getPropertyInfo(propertyToken);
                    const activeOffers = await Web3.getActiveOffers(propertyToken);
                    response = { propertyInfo, activeOffers };
                } catch (error) {
                    response = {
                        error: "Failed to get property information",
                        message: error.message
                    };
                }
        }

        return new Response(JSON.stringify({
            success: true,
            data: response,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("PropertyToken GET API Error:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "PropertyToken operation failed",
            message: error.message,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

// Create sell offer for property token
export const POST = async (req) => {
    try {
        const body = await req.json();
        const { propertyToken, pricePerToken, numTokens, saleType } = body;

        // Validate required parameters
        if (!propertyToken || !pricePerToken || !numTokens || !saleType) {
            return new Response(JSON.stringify({
                success: false,
                error: "Missing required parameters",
                required: ["propertyToken", "pricePerToken", "numTokens", "saleType"],
                timestamp: new Date().toISOString()
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Initialize Web3 service
        await Web3.init();

        // Create sell offer
        const txHash = await Web3.createSellOffer(propertyToken, pricePerToken, numTokens, saleType);

        return new Response(JSON.stringify({
            success: true,
            data: {
                transactionHash: txHash,
                propertyToken,
                pricePerToken,
                numTokens,
                saleType,
                message: "Sell offer created successfully"
            },
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("PropertyToken POST API Error:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "Failed to create sell offer",
            message: error.message,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
