pragma solidity ^0.4.10;

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



    function TicTacToe() public {
        contractOwner = msg.sender;
    }


    // Players
    mapping(address => Player) players;        // address = key, Player is value

    // Games
    uint counter = 0;
    mapping(uint => Game) games;
    uint[] openGameIds;

    struct Player {
        string name;
        address playerAddr;
    }

    struct Game {
        uint gameId;
        string name;
        address ownerAddr;
        bool isFinished;
        uint moveCounter;

        Player playerO;
        Player playerX;
        Player winner;

        //Bet[] bets;
        string[boardSize][boardSize] board;
    }

    struct Bet {
        uint value;
        //Player[2] players;     // players[0] = bet for X, players[1] = bet for O
    }


    function createGame(string gameName, string playerName) public returns (uint gameId) {
        Game memory myGame;
        myGame.gameId = counter;
        myGame.name = gameName;
        myGame.ownerAddr = msg.sender;

        Player memory playerO;
        playerO.name = playerName;
        playerO.playerAddr = msg.sender;
        myGame.playerO = playerO;

        games[counter] = myGame;


        return gameId = counter++;
    }

    function getOpenGameIds() public view returns (uint[] gameIds) {
        return openGameIds;
    }


    function joinGame(uint gameId, string playerName) public returns (bool){
        if(equalStrings(games[gameId].playerX.name, "")) {
            games[gameId].playerX.name = playerName;
            games[gameId].playerX.playerAddr = msg.sender;
            return true;
        }
        return false;
    }

    function startGame(uint gameId) public returns (bool) {
        if (games[gameId].ownerAddr == msg.sender
        && !equalStrings(games[gameId].playerX.name, "")
        && !equalStrings(games[gameId].playerO.name, "")) {
            initialize(gameId);
            return true;
        }
        return false;
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

    function initialize(uint gameId) private {
        for (uint y = 0; y < 3; y++) {
            for (uint x = 0; x < 3; x++) {
                games[gameId].board[y][x] = "";
                //TODO Ich glaube, dass ein string in Solidity immer mit "" initialisiert wird, da es kein null gibt, was meint Blockchain Entrepreneur Lucas dazu?
            }
        }
        openGameIds.push(gameId);
    }

    function playMove(uint x, uint y, uint gameId) public returns (bool) {
        if(games[gameId].playerX.playerAddr == msg.sender
        && games[gameId].moveCounter % 2 == 0   // host's turn?
        && equalStrings(games[gameId].board[x][y],"")){
            games[gameId].board[x][y] = "X";
            games[gameId].moveCounter += 1;
            checkForWinner(x, y, gameId, games[gameId].playerX);

            return true;
        }
        else if(games[gameId].playerO.playerAddr == msg.sender
        && games[gameId].moveCounter % 2 == 1   // guest's turn?
        && equalStrings(games[gameId].board[x][y], "")) {
            games[gameId].board[x][y] = "O";
            games[gameId].moveCounter += 1;
            checkForWinner(x, y, gameId, games[gameId].playerO);
            
            return true;
        }
        return false;
    }

    function checkForWinner(uint x, uint y, uint gameId, Player currentPlayer) private {
        if(games[gameId].moveCounter < 2*boardSize -1) {
            return;
        }

        string [boardSize][boardSize] storage board = games[gameId].board;
        string storage symbol = games[gameId].board[x][y];

        //check column
        for (uint i = 0; i < boardSize; i++) {
            if(!equalStrings(games[gameId].board[i][i], symbol)) {
                break;
            }
            if(i == (boardSize -1)) {
                games[gameId].winner = currentPlayer;
                games[gameId].isFinished = true;
                return;
            }
        }

        //check row
        for ( i = 0; i < boardSize; i++) {
            if(!equalStrings(games[gameId].board[i][y], symbol)) {
                break;
            }

            if(i == (boardSize -1)) {
                games[gameId].winner = currentPlayer;
                games[gameId].isFinished = true;
                return;
            }
        }

        //check diagonal
        if(x == y) {
            for (i = 0; i < boardSize; i++) {
                if(!equalStrings(games[gameId].board[i][i], symbol)) {
                    break;
                }
                if(i == (boardSize -1)) {
                    games[gameId].winner = currentPlayer;
                    games[gameId].isFinished = true;
                    return;
                }
            }
        }

        // check anti diagonal
        if(x + y == (boardSize -1)) {
            for (i = 0; i < boardSize; i++) {
                if(!equalStrings(games[gameId].board[x][(boardSize-1) - 1], symbol)) {
                    break;
                }
                if(i == (boardSize -1)) {
                    games[gameId].winner = currentPlayer;
                    games[gameId].isFinished = true;
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
