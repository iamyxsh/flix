// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Flix is Initializable, OwnableUpgradeable, ERC721AUpgradeable {
    string public movieName;
    uint256 public releaseDate;
    uint256 public ticketPrice;
    uint256 public totalTickets;
    uint256 public totalSold = 0;

    mapping(address => bool) public votes;

    function setData(
        string calldata _name,
        uint256 _totalTickets,
        uint256 _ticketPrice,
        uint256 _releaseDate,
        address _owner
    ) public initializer initializerERC721A {
        movieName = _name;
        releaseDate = _releaseDate;
        ticketPrice = _ticketPrice;
        totalTickets = _totalTickets;
        __Ownable_init();
        transferOwnership(_owner);
        __ERC721A_init(_name, _name);
    }

    function bookTickets(uint256 _qty) external payable {
        require(
            msg.value >= (ticketPrice * _qty),
            "send the correct booking fee"
        );

        require(totalTickets >= totalSold + _qty, "not enough tickets left");

        _mint(msg.sender, _qty);
        totalSold += _qty;
    }

    function collection() external view returns (uint256) {
        return address(this).balance;
    }

    function withdrawCollection() external {
        address payable owner = payable(owner());
        owner.transfer(address(this).balance);
    }

    function ticketsLeft() external view returns (uint256) {
        return totalTickets - totalSold;
    }
}
