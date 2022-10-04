// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Flix is Initializable, OwnableUpgradeable {
    string public name;
    uint256 public releaseDate;
    uint256 public ticketPrice;
    uint256 public totalTickets;

    function setData(
        string calldata _name,
        uint256 _totalTickets,
        uint256 _ticketPrice,
        uint256 _releaseDate
    ) public initializer {
        name = _name;
        releaseDate = _releaseDate;
        ticketPrice = _ticketPrice;
        totalTickets = _totalTickets;
    }
}
