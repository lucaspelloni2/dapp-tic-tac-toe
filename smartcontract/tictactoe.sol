pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

library Strings {

    function concat(string _base, string _value) internal pure returns (string) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        string memory _tmpValue = new string(_baseBytes.length + _valueBytes.length);
        bytes memory _newValue = bytes(_tmpValue);

        uint i;
        uint j;

        for(i=0; i<_baseBytes.length; i++) {
            _newValue[j++] = _baseBytes[i];
        }

        for(i=0; i<_valueBytes.length; i++) {
            _newValue[j++] = _valueBytes[i++];
        }

        return string(_newValue);
    }

}

contract TicTacToe {
    using Strings for string;
    uint constant boardSize = 3;
    address contractOwner;
    
    event SuccessEvent(uint ID, bool returnValue);



    function TicTacToe() public {
        contractOwner = msg.sender;
    }


    // Players
    mapping(address => Player) public players;        // address = key, Player is value

    // Games
    uint counter = 0;
    mapping(uint => Game) public games;
    uint[] openGameIds;
    
    // bets
    uint betCounter = 0;
    mapping(uint => Bet) public bets;
    uint[] openBetIds;

    struct Player {
        string name;
    }
    
    struct Game {
        uint gameId;
        string name;
        address ownerAddr;
        bool isStarted;
        bool isFinished;
        uint moveCounter;

        bool isPlayerOSet;
        address playerOAddr;
        bool isPlayerXSet;
        address playerXAddr;
        
        address winnerAddr;

        string[boardSize][boardSize] board;
    }

    struct Bet {
        uint value;
        uint gameId;
        bool isBettorOSet;
        address bettorOnOAddr;
        bool isBettorXSet;
        address bettorOnXAddr;
        bool isBetFilled;
    }


    function createGame(string gameName, string playerName) public returns (uint gameId) {
        gameId = counter++;
        Game storage myGame = games[gameId];
        
        myGame.gameId = gameId;
        myGame.name = gameName;
        myGame.ownerAddr = msg.sender;

        myGame.playerOAddr = msg.sender;
        players[msg.sender].name = playerName;

        myGame.isPlayerOSet = true;
        myGame.isPlayerXSet = false;

        openGameIds.push(gameId);
        
        emit SuccessEvent(gameId, true);
        return gameId;
    }

    function getOpenGameIds() public view returns (uint[] gameIds) {
        return openGameIds;
    }
    
    function getOpenGames() public view returns (uint[] gameIds, string[] gameNames, string[] ownerNames, string[] playerO, string[] playerX) {
        
        gameIds = new uint[](openGameIds.length);
        gameNames = new string[](openGameIds.length);
        ownerNames = new string[](openGameIds.length);
        playerO = new string[](openGameIds.length);
        playerX = new string[](openGameIds.length);
        
        for(uint i=0; i<openGameIds.length; i++) {
            //Game memory game = games[openGameIds[i]];
            gameIds[i] = games[openGameIds[i]].gameId;
            gameNames[i] = games[openGameIds[i]].name;
            ownerNames[i] = players[games[openGameIds[i]].ownerAddr].name;
            playerO[i] = players[games[openGameIds[i]].playerOAddr].name;
            playerX[i] = players[games[openGameIds[i]].playerXAddr].name;
        }
    }

    event Joined(uint gameId, string symbol, bool returnValue);
    function joinGame(uint gameId, string playerName) public returns (bool){
        Game storage game = games[gameId];
        
        players[msg.sender].name = playerName;
        
        if(!game.isPlayerOSet) {
            game.playerOAddr = msg.sender;
            game.isPlayerOSet = true;
            
            emit Joined(game.gameId,"O", true);
            return true;
        }
        if (!game.isPlayerXSet) {
            game.playerXAddr = msg.sender;
            game.isPlayerXSet = true;
            
            emit Joined(game.gameId, "X", true);
            return true;
        }
        emit Joined(game.gameId, "game is full", false);
        return false;
        
        //TODO if joined remove from openGameIds
    }

    function startGame(uint gameId) public returns (bool) {
        Game storage game = games[gameId];
        
        if (game.ownerAddr == msg.sender
            && game.isPlayerXSet
            && game.isPlayerOSet ) {
            
            initialize(gameId);
            game.isStarted = true;
            return true;
        }
        return false;
    }
    
    function initialize(uint gameId) private {
        for (uint y = 0; y < boardSize; y++) {
            for (uint x = 0; x < boardSize; x++) {
                games[gameId].board[y][x] = "";
                //TODO Ich glaube, dass ein string in Solidity immer mit "" initialisiert wird, da es kein null gibt, was meint Blockchain Entrepreneur Lucas dazu?
            }
        }
        //openGameIds.push(gameId); -> already opened at createGame
    }
    
    function getBoard(uint gameId) public view returns (string boardAsString) { // apparently no string array can be returned yet in solidity
        string storage boardRepresentation;
        for(uint i = 0; i < boardSize; i++) {
            for(uint j = 0; j < boardSize; j++) {
                boardRepresentation.concat(games[gameId].board[i][j]);
            }
            boardRepresentation.concat("%n");
        }
        return boardRepresentation;
    }

    function playMove(uint x, uint y, uint gameId) public returns (bool) {
        Game storage game = games[gameId];
        if(game.playerXAddr == msg.sender
        && game.moveCounter % 2 == 0   // host's turn?
        && equalStrings(game.board[x][y],"")){
            game.board[x][y] = "X";
            game.moveCounter += 1;
            checkForWinner(x, y, gameId, game.playerXAddr);

            return true;
        }
        else if(game.playerOAddr == msg.sender
        && game.moveCounter % 2 == 1   // guest's turn?
        && equalStrings(game.board[x][y], "")) {
            game.board[x][y] = "O";
            game.moveCounter += 1;
            checkForWinner(x, y, gameId, game.playerOAddr);
            
            return true;
        }
        return false;
    }

    function checkForWinner(uint x, uint y, uint gameId, address currentPlayer) private {
        Game storage game = games[gameId];
        if(game.moveCounter < 2*boardSize -1) {
            return;
        }

        string [boardSize][boardSize] storage board = game.board;
        string storage symbol = game.board[x][y];

        //check column
        for (uint i = 0; i < boardSize; i++) {
            if(!equalStrings(game.board[i][i], symbol)) {
                break;
            }
            if(i == (boardSize -1)) {
                game.winnerAddr = currentPlayer;
                game.isFinished = true;
                return;
            }
        }

        //check row
        for ( i = 0; i < boardSize; i++) {
            if(!equalStrings(game.board[i][y], symbol)) {
                break;
            }

            if(i == (boardSize -1)) {
                game.winnerAddr = currentPlayer;
                game.isFinished = true;
                return;
            }
        }

        //check diagonal
        if(x == y) {
            for (i = 0; i < boardSize; i++) {
                if(!equalStrings(game.board[i][i], symbol)) {
                    break;
                }
                if(i == (boardSize -1)) {
                    game.winnerAddr = currentPlayer;
                    game.isFinished = true;
                    return;
                }
            }
        }

        // check anti diagonal
        if(x + y == (boardSize -1)) {
            for (i = 0; i < boardSize; i++) {
                if(!equalStrings(game.board[x][(boardSize-1) - 1], symbol)) {
                    break;
                }
                if(i == (boardSize -1)) {
                    game.winnerAddr = currentPlayer;
                    game.isFinished = true;
                }
            }
        }
    }

    function isGameFinished (uint gameId) public view returns (bool) {
        return games[gameId].isFinished;
    }
    function equalStrings (string a, string b) private pure returns (bool){
        return keccak256(a) == keccak256(b);
    }
}
