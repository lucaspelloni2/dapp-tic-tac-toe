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
        uint256 bet; 
        address[] playersAddr; 
    }
    
    address owner;  
    
    
    // address = key, player is value
    mapping(address => Player) players; 
    mapping(address => Game) games; 
    address[] gamesAddresses ; 
    
    function TicTacToe() public {
        owner = msg.sender; 
    }
    
    function createGame(address gameAddr, address gameOwner) public {
        games[gameAddr].playersAddr.push(gameOwner); 
        gamesAddresses.push(gameAddr); 
    }
    
    
    
    
    
}