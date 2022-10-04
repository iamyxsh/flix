// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Flix.sol";

contract FlixFactory is Ownable {
    address public immutable flixAddress;

    uint256 public totalSupply;

    mapping(uint256 => address) public idToAddress;
    mapping(address => string) public addressToName;

    event MovieCreated(address);

    constructor(address _flixAddress) {
        flixAddress = _flixAddress;
    }

    function createMovie(
        string calldata _name,
        uint256 _totalTickets,
        uint256 _price,
        uint256 __releaseDate
    ) public returns (address clone) {
        bytes32 salt = keccak256(
            abi.encodePacked(_name, _totalTickets, _price, __releaseDate)
        );

        clone = Clones.cloneDeterministic(flixAddress, salt);

        Flix(clone).setData(_name, _totalTickets, _price, __releaseDate);

        unchecked {
            idToAddress[totalSupply] = clone;
            addressToName[clone] = _name;
            totalSupply++;
        }

        emit MovieCreated(clone);
    }
}
