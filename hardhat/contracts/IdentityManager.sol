// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract IdentityManager is Ownable {
    // --- State Variables ---

    struct UserIdentity {
        bool isVerified;
    }

    mapping(address => UserIdentity) public verifiedUsers;
    mapping(address => bool) public verifiers;
    address[] private verifiedUserAddresses;

    // --- Events ---

    event UserVerified(
        uint256 timestamp,
        address user
    );
   
    // --- Modifiers ---

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Not authorized verifier");
        _;
    }

    // --- Functions ---

    constructor() Ownable(msg.sender) {
        // The deployer of the contract is automatically set as the first verifier.
        verifiers[msg.sender] = true;
    }

    /**
     * @notice Verifies a new user.
     * @dev Can only be called by an authorized verifier. Adds the user to the
     * verifiedUsers mapping and the verifiedUserAddresses array.
     * @param user The address of the user to verify.
     */
    function verifyUser(
        address user
    ) external onlyVerifier {
        require(user != address(0), "Invalid address: Cannot verify the zero address");
        require(!verifiedUsers[user].isVerified, "State error: User is already verified");

        // Update the user's verification status
        verifiedUsers[user] = UserIdentity({
            isVerified: true
        });

        // Add the user's address to the list of all verified users
        verifiedUserAddresses.push(user);

        emit UserVerified(block.timestamp, user);
    }

    /**
     * @notice Gets a list of all verified user addresses.
     * @dev This is a view function and does not consume gas when called externally.
     * @return A memory array of addresses containing all users who have been verified.
     */
    function getAllVerifiedUsers() 
        external 
        view 
        returns (address[] memory) 
    {
        return verifiedUserAddresses;
    }
}
