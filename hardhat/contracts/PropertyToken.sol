// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IdentityManager.sol";

contract PropertyToken is ERC20, Ownable {
    IdentityManager public immutable identityManager;
    
    struct PropertyDetails {
        
        string location;
        uint256 price;
        address owner;
    }

    PropertyDetails public propertyDetails;
    uint256 private constant TOTAL_SUPPLY = 100000 * 10**18;

    event PropertyTokenized(
        
        string location,
        uint256 price,
        address owner
    );

    constructor(
        string memory _name,
        string memory _symbol,
      
        string memory _location,
        uint256 _price,
        address _owner,
        address _identityManager
    ) 
        ERC20(_name, _symbol)
        Ownable(_owner) 
    {
        identityManager = IdentityManager(_identityManager);
        propertyDetails = PropertyDetails({
            location: _location,
            price: _price,
            owner: _owner
        });

        _mint(_owner, TOTAL_SUPPLY);
        transfer(_owner, TOTAL_SUPPLY);

        emit PropertyTokenized(
           
            _location,
            _price,
            _owner
        );
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        require(identityManager.verifiedUsers(msg.sender), "Sender not verified");
        require(identityManager.verifiedUsers(to), "Receiver not verified");
        return super.transfer(to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(identityManager.verifiedUsers(from), "Sender not verified");
        require(identityManager.verifiedUsers(to), "Receiver not verified");
        return super.transferFrom(from, to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }
}