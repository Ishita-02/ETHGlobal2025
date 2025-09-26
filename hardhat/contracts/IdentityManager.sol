// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract IdentityManager is Ownable {
    struct UserIdentity {
        bool isVerified;
    }

    mapping(address => UserIdentity) public verifiedUsers;
    mapping(address => bool) public verifiers;

    event UserVerified(
        uint256 timestamp,
        address user
    );

    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
   
    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Not authorized verifier");
        _;
    }

    constructor() Ownable(msg.sender) {
        verifiers[msg.sender] = true;
        emit VerifierAdded(msg.sender);
    }

    function addVerifier(address verifier) external onlyOwner {
        require(!verifiers[verifier], "Already a verifier");
        verifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }


    function verifyUser(
        address user
    ) external onlyVerifier {
        require(user != address(0), "Invalid address");
        require(!verifiedUsers[user].isVerified, "Already verified");

        verifiedUsers[user] = UserIdentity({
            isVerified: true
        });

        emit UserVerified( block.timestamp, user);
    }

  
    function isUserVerified(address user) external view returns (bool) {
        return verifiedUsers[user].isVerified ;
    }

    function getUserDetails(address user) 
        external 
        view 
        returns (UserIdentity memory) 
    {
        require(verifiedUsers[user].isVerified, "User not verified");
        return verifiedUsers[user];
    }
}