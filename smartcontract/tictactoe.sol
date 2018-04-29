pragma solidity ^0.4.23;
//pragma experimental ABIEncoderV2;

contract TicTacToe {
    uint constant boardSize = 3;
    address contractOwner;

    enum GameState { NOT_EXISTING, EMPTY, WAITING_FOR_O, WAITING_FOR_X, READY, X_HAS_TURN, O_HAS_TURN, WINNER_X, WINNER_O, DRAW }
    enum BetState { MISSING_X_BETTOR, MISSING_O_BETTOR, WITHDRAWN, FIXED, PAYEDOUT }
    enum SquareState { EMPTY, X, O }
    

    constructor() public {
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
        uint[] gameIds;
    }
    
    struct Game {
        uint gameId;
        string name;
        address ownerAddr;
        
        GameState state;
        
        uint moveCounter;

        address playerOAddr;
        address playerXAddr;
        
        address winnerAddr;
        
        SquareState[boardSize][boardSize] board;
    }

    struct Bet {
        uint value;
        uint gameId;
        BetState state;
        bool isBettorOSet;
        address bettorOnOAddr;
        bool isBettorXSet;
        address bettorOnXAddr;
        bool isBetFilled;
    }

    event GameCreated(bool wasSuccess, uint gameId, GameState state, string message);
    function createGame(string gameName, string playerName) public returns (uint gameId) {
        gameId = counter++;
        Game storage myGame = games[gameId];
        
        myGame.gameId = gameId;
        myGame.name = gameName;
        myGame.ownerAddr = msg.sender;
        myGame.state = GameState.EMPTY;

        joinGame(gameId, playerName);
        
        openGameIds.push(gameId);
        
        emit GameCreated(true, gameId, myGame.state, "created");
        return gameId;
    }
    
    function getGameIds() public view returns (uint[] gameIds) {
        return openGameIds;
    }
    
    function getGameIdsWithState(GameState state) public view returns (uint[] gameIds) {
        uint[] memory ids;
        uint index = 0;
        for (uint i=0; i < openGameIds.length; i++) {
            if (games[openGameIds[i]].state == state)
                ids[index] = openGameIds[i];
        }
        return ids;
    }
    
    /*function getOpenGames() public view returns (uint[] gameIds, string[] gameNames, string[] ownerNames, string[] playerO, string[] playerX) {
        
        gameIds = new uint[](openGameIds.length);
        gameNames = new string[](openGameIds.length);
        ownerNames = new string[](openGameIds.length);
        playerO = new string[](openGameIds.length);
        playerX = new string[](openGameIds.length);
        
        for(uint i=0; i<openGameIds.length; i++) {
            Game memory game = games[openGameIds[i]];
            gameIds[i] = game.gameId;
            gameNames[i] = game.name;
            ownerNames[i] = players[game.ownerAddr].name;
            playerO[i] = players[game.playerOAddr].name;
            playerX[i] = players[game.playerXAddr].name;
        }
        
        return (gameIds, gameNames, ownerNames, playerO, playerX);
    }*/

    event Joined(bool wasSuccess, uint gameId, GameState state, string playerName, string symbol);
    function joinGame(uint gameId, string playerName) public {
        Game storage game = games[gameId];
        
        require(game.state != GameState.NOT_EXISTING, "The game does not exist.");
        require(game.state < GameState.READY, "The game is full." );
        
        players[msg.sender].name = playerName;
        
        if(game.state == GameState.EMPTY) {
            game.playerOAddr = msg.sender;
            game.state = GameState.WAITING_FOR_X;
            
            emit Joined(true, game.gameId,game.state, playerName, "O");
        }
        else if (game.state == GameState.WAITING_FOR_X) {
            //require(game.playerOAddr != msg.sender, "Player is already part of this game.");
            
            game.playerXAddr = msg.sender;
            game.state = GameState.READY;
            
            emit Joined(true, game.gameId,game.state, playerName, "X");
        }
        else if (game.state == GameState.WAITING_FOR_O) {
            //require(game.playerXAddr != msg.sender, "Player is already part of this game.");
            
            game.playerOAddr = msg.sender;
            game.state = GameState.READY;
            
            emit Joined(true, game.gameId,game.state, playerName, "O");
        }
    }
    
    event Left(bool wasSuccess, uint gameId, GameState state, string playerName, string symbol);
    function leaveGame(uint gameId) public {
        Game storage game = games[gameId];
        
        require(game.state != GameState.NOT_EXISTING, "The game does not exist.");
        require(game.state <= GameState.READY, "The game is already started." );
        require(game.playerOAddr == msg.sender || game.playerXAddr == msg.sender, "Player is not part of this game.");

        if (game.state == GameState.WAITING_FOR_X
            && game.playerOAddr == msg.sender ) {
            game.playerOAddr = address(0);
            game.state = GameState.EMPTY;
            emit Left(true, game.gameId, game.state, players[msg.sender].name, "O");
        }
        else if (game.state == GameState.WAITING_FOR_O
                && game.playerXAddr == msg.sender ) {
            game.playerXAddr = address(0);
            game.state = GameState.EMPTY;
            emit Left(true, game.gameId, game.state, players[msg.sender].name, "X");
        }
        else if (game.state == GameState.READY
                && game.playerXAddr == msg.sender ) {
            game.playerXAddr = address(0);
            game.state = GameState.WAITING_FOR_X;
            emit Left(true, game.gameId, game.state, players[msg.sender].name, "X");
        }
        else if (game.state == GameState.READY
                && game.playerOAddr == msg.sender ) {
            game.playerOAddr = address(0);
            game.state = GameState.WAITING_FOR_O;
            emit Left(true, game.gameId, game.state, players[msg.sender].name, "O");
        }
    }

    event GameStarted(bool wasSuccess, uint gameId, GameState state, string message);
    function startGame(uint gameId) public {
        Game storage game = games[gameId];
        
        require(game.state != GameState.NOT_EXISTING, "The game does not exist.");
        require(game.state == GameState.READY, "Not enough players to start the game.");
        require(game.ownerAddr == msg.sender, "Only the game owner can start the game.");
        
        initialize(gameId);
        game.state = GameState.X_HAS_TURN;
        
        emit GameStarted(true, gameId, game.state, "game has been started.");
    }
    
    function initialize(uint gameId) private {
        SquareState[boardSize][boardSize] storage board = games[gameId].board;
        for (uint y = 0; y < boardSize; y++) {
            for (uint x = 0; x < boardSize; x++) {
                board[y][x] = SquareState.EMPTY;
            }
        }
    }
    
    /*function getBoard(uint gameId) public view returns (bytes boardRep) { // apparently no string array can be returned yet in solidity
        string[boardSize][boardSize] storage board = games[gameId].board;
        string memory boardRepresentation;
        for(uint y = 0; y < boardSize; y++) {
            for(uint x = 0; x < boardSize; x++) {
                boardRepresentation = strConcat(boardRepresentation,board[y][x]);
            }
            boardRepresentation = strConcat(boardRepresentation,"\n");
        }
        return bytes(boardRepresentation);
        
    }*/
    
    function getBoard(uint gameId) public view returns (SquareState[boardSize*boardSize]) { // apparently no string array can be returned yet in solidity
        SquareState[boardSize][boardSize] memory board = games[gameId].board;
        SquareState[boardSize*boardSize] memory boardRep;
        uint i=0;
        for(uint y = 0; y < boardSize; y++) {
            for(uint x = 0; x < boardSize; x++) {
                boardRep[i++] = board[y][x];
            }
        }
        return boardRep;
    }

    event MoveMade(bool success, uint gameId, GameState state, uint x, uint y, string symbol);
    function playMove(uint gameId, uint x, uint y) public {
        Game storage game = games[gameId];
        
        require(game.state >= GameState.X_HAS_TURN, "The game is not started yet.");
        require(game.state < GameState.WINNER_X, "The game is already finished.");
        
        if (game.state == GameState.X_HAS_TURN) {
            require(game.playerXAddr == msg.sender, "Sender not equal player X");
            require(game.board[y][x] == SquareState.EMPTY, "Move not possible because the square is not empty.");
            
            game.board[y][x] = SquareState.X;
            game.moveCounter += 1;
            game.state = GameState.O_HAS_TURN;
            checkForWinner(x, y, gameId, game.playerXAddr);
            
            emit MoveMade(true, gameId, game.state, x, y, "X");
        }
        else {
            require(game.playerOAddr == msg.sender, "Sender not equal player O");
            require(game.board[y][x] == SquareState.EMPTY, "Move not possible because the square is not empty.");
            
            game.board[y][x] = SquareState.O;
            game.moveCounter += 1;
            game.state = GameState.X_HAS_TURN;
            checkForWinner(x, y, gameId, game.playerOAddr);
            
            emit MoveMade(true, gameId, game.state, x, y, "O");
        }
    }

    function checkForWinner(uint x, uint y, uint gameId, address currentPlayer) private {
        Game storage game = games[gameId];
        
        /*if(game.moveCounter < 2*boardSize -1) {           //what is reason for that?
            return;
        }*/

        SquareState[boardSize][boardSize] memory board = game.board;
        SquareState symbol = game.board[y][x];

        //check column
        for (uint i = 0; i < boardSize; i++) {
            if (board[i][i] != symbol)  {         //!equalStrings(board[i][i], symbol)) {
                //break;
            }
            else if(i == (boardSize -1)) {
                game.winnerAddr = currentPlayer;
                game.state = getGameState(symbol);
                return;
            }
        }

        //check row
        for (i = 0; i < boardSize; i++) {
            if(board[i][y] != symbol) {
                //break;
            }

            else if(i == (boardSize -1)) {
                game.winnerAddr = currentPlayer;
                game.state = getGameState(symbol);
                return;
            }
        }

        //check diagonal
        if(x == y) {
            for (i = 0; i < boardSize; i++) {
                if(board[i][i] != symbol) {
                    //break;
                }
                else if(i == (boardSize -1)) {
                    game.winnerAddr = currentPlayer;
                    game.state = getGameState(symbol);
                    return;
                }
            }
        }

        // check anti diagonal
        if(x + y == (boardSize -1)) {
            for (i = 0; i < boardSize; i++) {
                if(board[x][boardSize-1-1] != symbol) {            //!equalStrings(board[x][(boardSize-1) - 1], symbol)) {
                    //break;
                }
                else if(i == (boardSize -1)) {
                    game.winnerAddr = currentPlayer;
                    game.state = getGameState(symbol);
                    return;
                }
            }
        }
        
        //check for draw
        if (game.moveCounter == boardSize*boardSize) {
            game.state = GameState.DRAW;
        }
                
    }
    
    function getGameState(SquareState symbol) private pure returns (GameState state) {
        if (symbol == SquareState.X)
            return GameState.WINNER_X;
        else
            return GameState.WINNER_O;
    }
    
    function equalStrings (string a, string b) private pure returns (bool){
        return keccak256(a) == keccak256(b);
    }
    

}
