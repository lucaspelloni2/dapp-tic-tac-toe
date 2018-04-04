pragma solidity ^0.4.10;


contract TicTacToe {
    
    struct Player {
        string name; 
        uint256 amount; 
        Game[] games; 
    }
    
    struct Board {
        
    }
    
    struct Game {
        string name; 
        address gameAddr; 
        uint256 bet; 
        address[] playersAddr; 
        
    }
    
    address owner;  
    
    
    // address = key, player is value
    mapping(address => Player) players; 
    mapping(address => Game) games; 
    
    Game[] public gamesObjects; 
    
    function TicTacToe() public {
        owner = msg.sender; 
    }
    
    function createGame(address gameAddr, string name) public {
        if (msg.sender == owner) {
            revert(); 
        }
        address gameOwner = msg.sender; 
        games[gameAddr].name = name; 
        games[gameAddr].gameAddr = gameAddr; 
        games[gameAddr].playersAddr.push(gameOwner); 
        gamesObjects.push(games[gameAddr]); 
    }
    
    
    function joinGame(address gameAddr) public {
        if (msg.sender == owner) {
            revert(); 
        }
        
    }
    
    function alreadyCreated(address gameAddr) returns (bool) {
        for (uint i = 0; i < gamesObjects.length; i++) {
            // TODO: check if the given game has been already created
        }
    }
    
    
    
    
    
}