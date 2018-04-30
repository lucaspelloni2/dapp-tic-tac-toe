    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
    
        assembly {
            result := mload(add(source, 32))
        }
    }
    
    /*
    / motherfucking NOOOOT WOOORKING
    */
    function strConcat(string _a, string _b) internal returns (string) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ab = new string(_ba.length + _bb.length);
        bytes memory bab = bytes(ab);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) bab[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) bab[k++] = _bb[i];
        return string(bab);
    }
	
	
	
    function equalStrings (string a, string b) private pure returns (bool){
        return keccak256(a) == keccak256(b);
    }




    function getGameIdsWithState(GameState state) public view returns (uint[] gameIds) {
        // must be done like that because dynamic arrays only possible in storage and then the method becomes payable
        uint count = 0;
        for (uint i=0; i < openGameIds.length; i++)
            if (games[openGameIds[i]].state == state)
                count++;

        uint[] memory ids = new uint[](count);
        count = 0;
        for (i=0; i < openGameIds.length; i++)
            if (games[openGameIds[i]].state == state)
                ids[count++] = openGameIds[i];

        return ids;
    }
    
