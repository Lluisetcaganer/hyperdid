// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HyperDIDRegistry {
    mapping(string => address) private owners;
    mapping(string => string) private hyperDidPointer;

    function registerID(string memory id, string memory pointer) public {
        require(isValidID(id), "ID invalido");
        require(owners[id] == address(0), "ID ya registrado");

        owners[id] = msg.sender;
        hyperDidPointer[id] = pointer;
    }

    function updateID(string memory id, string memory newPointer) public {
        require(owners[id] == msg.sender, "No eres el propietario");
        hyperDidPointer[id] = newPointer;
    }

    function transferID(string memory id, address newOwner) public {
        require(owners[id] == msg.sender, "No eres el propietario");
        require(newOwner != address(0), "Nueva direccion invalida");
        owners[id] = newOwner;
    }

    function deleteID(string memory id) public {
        require(owners[id] == msg.sender, "No eres el propietario");
        delete owners[id];
        delete hyperDidPointer[id];
    }

    function resolve(string memory id) public view returns (string memory) {
        return hyperDidPointer[id];
    }

    function ownerOf(string memory id) public view returns (address) {
        return owners[id];
    }

    function exists(string memory id) public view returns (bool) {
        return owners[id] != address(0);
    }

    function isValidID(string memory id) internal pure returns (bool) {
        bytes memory b = bytes(id);
        if (b.length == 0 || b.length > 32) return false;
        for (uint i = 0; i < b.length; i++) {
            bytes1 char = b[i];
            if (
                !(char >= 0x30 && char <= 0x39) && // 0-9
                !(char >= 0x41 && char <= 0x5A) && // A-Z
                !(char >= 0x61 && char <= 0x7A)    // a-z
            ) {
                return false;
            }
        }
        return true;
    }
}
