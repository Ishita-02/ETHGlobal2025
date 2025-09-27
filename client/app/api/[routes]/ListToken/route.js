import Web3Service from "@/components/services/Web3Service";

const Web3 = new Web3Service();

export const GET = async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const propertyToken = searchParams.get('propertyToken');
        const userAddress = searchParams.get('userAddress');
        const offerId = searchParams.get('offerId');

        // Initialize Web3 service
        await Web3.init();

        let response = {};

        // Get property information
        if (propertyToken) {
            try {
                const propertyInfo = await Web3.getPropertyInfo(propertyToken);
                response.propertyInfo = propertyInfo;
            } catch (error) {
                console.error("Error getting property info:", error);
                response.propertyInfoError = error.message;
            }
        }

        // Get active offers for a property
        if (propertyToken) {
            try {
                const activeOffers = await Web3.getActiveOffers(propertyToken);
                response.activeOffers = activeOffers;
            } catch (error) {
                console.error("Error getting active offers:", error);
                response.activeOffersError = error.message;
            }
        }

        // Get user offers
        if (userAddress) {
            try {
                const userOffers = await Web3.getUserOffers(userAddress);
                response.userOffers = userOffers;
            } catch (error) {
                console.error("Error getting user offers:", error);
                response.userOffersError = error.message;
            }
        }

        // Get specific offer details
        if (offerId) {
            try {
                const offerDetails = await Web3.getSellOffer(offerId);
                response.offerDetails = offerDetails;
            } catch (error) {
                console.error("Error getting offer details:", error);
                response.offerDetailsError = error.message;
            }
        }

        // If no specific parameters, return general marketplace info
        if (!propertyToken && !userAddress && !offerId) {
            response.message = "ListToken API - Provide parameters: propertyToken, userAddress, or offerId";
            response.availableEndpoints = {
                propertyInfo: "GET /api/[routes]/ListToken?propertyToken=0x...",
                activeOffers: "GET /api/[routes]/ListToken?propertyToken=0x...",
                userOffers: "GET /api/[routes]/ListToken?userAddress=0x...",
                offerDetails: "GET /api/[routes]/ListToken?offerId=123"
            };
        }

        return new Response(JSON.stringify({
            success: true,
            data: response,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error("ListToken API Error:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "Internal server error",
            message: error.message,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};

export const POST = async (req) => {
    try {
        const body = await req.json();
        const { propertyToken, dataUri, pricePerToken, numTokens, saleType } = body;

        // Initialize Web3 service
        await Web3.init();

        let response = {};

        // Register property if dataUri is provided
        if (propertyToken && dataUri) {
            try {
                const txHash = await Web3.registerProperty(propertyToken, dataUri);
                response.registrationTxHash = txHash;
                response.message = "Property registered successfully";
            } catch (error) {
                console.error("Error registering property:", error);
                response.registrationError = error.message;
            }
        }

        // Create sell offer if all required parameters are provided
        if (propertyToken && pricePerToken && numTokens && saleType) {
            try {
                const txHash = await Web3.createSellOffer(propertyToken, pricePerToken, numTokens, saleType);
                response.sellOfferTxHash = txHash;
                response.message = "Sell offer created successfully";
            } catch (error) {
                console.error("Error creating sell offer:", error);
                response.sellOfferError = error.message;
            }
        }

        if (!propertyToken) {
            return new Response(JSON.stringify({
                success: false,
                error: "Missing required parameter: propertyToken",
                timestamp: new Date().toISOString()
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify({
            success: true,
            data: response,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error("ListToken POST API Error:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "Internal server error",
            message: error.message,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};
