import Web3Service from "@/components/services/Web3Service";

const Web3 = new Web3Service();

// Check if user is verified
export const GET = async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const userAddress = searchParams.get('userAddress');
        const action = searchParams.get('action');

        // Initialize Web3 service
        await Web3.init();

        let response = {};

        switch (action) {
            case 'checkVerification':
                if (!userAddress) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: "Missing userAddress parameter",
                        timestamp: new Date().toISOString()
                    }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
                const isVerified = await Web3.isUserVerified(userAddress);
                response = { isVerified, userAddress };
                break;

            case 'getAllVerifiedUsers':
                const verifiedUsers = await Web3.getAllVerifiedUsers();
                response = { verifiedUsers };
                break;

            case 'checkVerifier':
                const address = userAddress || Web3.getAccount();
                const isVerifier = await Web3.isVerifier(address);
                response = { isVerifier, address };
                break;

            case 'getOwner':
                const owner = await Web3.getIdentityManagerOwner();
                response = { owner };
                break;

            default:
                response = {
                    message: "IdentityManager API",
                    availableActions: [
                        "checkVerification",
                        "getAllVerifiedUsers", 
                        "checkVerifier",
                        "getOwner"
                    ],
                    usage: {
                        checkVerification: "GET /api/[routes]/IdentityManager?action=checkVerification&userAddress=0x...",
                        getAllVerifiedUsers: "GET /api/[routes]/IdentityManager?action=getAllVerifiedUsers",
                        checkVerifier: "GET /api/[routes]/IdentityManager?action=checkVerifier&userAddress=0x...",
                        getOwner: "GET /api/[routes]/IdentityManager?action=getOwner"
                    }
                };
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
        console.error("IdentityManager GET API Error:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "IdentityManager operation failed",
            message: error.message,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

// Verify user
export const POST = async (req) => {
    try {
        const body = await req.json();
        const { userAddress } = body;

        // Validate required parameters
        if (!userAddress) {
            return new Response(JSON.stringify({
                success: false,
                error: "Missing required parameter: userAddress",
                timestamp: new Date().toISOString()
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Initialize Web3 service
        await Web3.init();

        // Verify user
        const txHash = await Web3.verifyUser(userAddress);

        return new Response(JSON.stringify({
            success: true,
            data: {
                transactionHash: txHash,
                userAddress,
                message: "User verified successfully"
            },
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("IdentityManager POST API Error:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "Failed to verify user",
            message: error.message,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
