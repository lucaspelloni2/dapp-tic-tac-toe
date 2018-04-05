pragma solidity ^0.4.10;


contract TicTacToe {
    
    address contractOwner;
    
    function TicTacToe() public {
        contractOwner = msg.sender; 
    }
    
    
    // Players
    mapping(address => Player) players;        // address = key, Player is value
    
    // Games
    uint counter = 0;
    mapping(uint => Game) games;
    
    struct Player {
        string name;
        address playerAddr;
        Game[] games;
    }
    
    struct Game {
        uint gameId;
        string name;
        address ownerAddr;
        Player[] players;
        Bet[] bets;
        string[3][3] board;
    }
    
    struct Bet {
        uint value;
        //Player[2] players;     // players[0] = bet for X, players[1] = bet for O
    }    
    
    function createPlayer(string name, address playerAddr) public   {
        
        Player storage myPlayer;
        myPlayer.name = name;
        myPlayer.playerAddr = playerAddr;
        
        players[playerAddr] = myPlayer;
    }
    
    
    function createGame(string name, address ownerAddr) public returns (uint gameId) {
        Game storage myGame;
        myGame.gameId = counter;
        myGame.name = name;
        myGame.ownerAddr = ownerAddr;
        
        games[counter] = myGame;
        players[ownerAddr].games.push(myGame);
        
        return gameId = counter++;
    }
    
    
    function joinGame(uint gameId, address playerAddr) public {
        if (games[gameId].players.length < 2)
            games[gameId].players.push(players[playerAddr]);
    }
    
    function startGame(uint gameId) public {
        if (games[gameId].ownerAddr == msg.sender
            && games[gameId].players.length == 2) {
            initialize(gameId);
        }
    }
    
    function initialize(uint gameId) public {
        for (uint y = 0; y < 3; y++) {
            for (uint x = 0; x < 3; x++) {
                games[gameId].board[y][x] = "";
            }
        }
    }
    
}