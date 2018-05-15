pragma solidity ^0.4.23;
//pragma experimental ABIEncoderV2;

contract TicTacToe {

    using SafeMath for uint;

    // width (number of squares) of a board side
    uint constant boardSize = 3;

    /*
    *   Players
    */
    mapping(address => Player) public players;        // address = key, Player is value

    struct Player {// will be saved offchain in future
        bytes32 name;
        uint[] gameIds;
    }

    /*
    *   Games
    */
    uint counter = 0;
    mapping(uint => Game) public games;
    uint[] openGameIds;

    enum GameState {NOT_EXISTING, EMPTY, WAITING_FOR_O, WAITING_FOR_X, READY, X_HAS_TURN, O_HAS_TURN, WINNER_X, WINNER_O, DRAW}
    enum SquareState {EMPTY, X, O}

    struct Game {
        uint gameId;
        bytes32 name;                                 // will be saved offchain in future
        address ownerAddr;
        GameState state;
        uint moveCounter;
        address playerOAddr;
        address playerXAddr;
        address winnerAddr;
        SquareState[boardSize][boardSize] board;
    }

    /*
    *   Bets
    */
    uint betCounter = 0;
    mapping(uint => Bet) public bets;
    uint[] openBetIds;

    enum BetState {NOT_EXISTING, MISSING_X_BETTOR, MISSING_O_BETTOR, WITHDRAWN, FIXED, PAYEDOUT}

    struct Bet {
        uint betId;
        uint gameId;
        uint value;
        BetState state;
        address bettorOnOAddr;
        address bettorOnXAddr;
    }



    /*
    *   lobby functions
    */

    event GameCreated(bool wasSuccess, uint gameId, GameState state, string message);
    function createGame(bytes32 gameName, bytes32 playerName) public {
        uint gameId = counter++;
        Game storage myGame = games[gameId];

        myGame.gameId = gameId;
        myGame.name = gameName;
        myGame.ownerAddr = msg.sender;
        myGame.state = GameState.EMPTY;

        joinGame(gameId, playerName);

        openGameIds.push(gameId);

        emit GameCreated(true, gameId, myGame.state, "Game created");
    }

    function getGameIds() public view returns (uint[] gameIds) {
        return openGameIds;
    }

    function getGames() public view returns (uint[] gameIds, GameState[] gameStates, bytes32[] gameNames
    , address[] owners, bytes32[] ownerNames, address[] playerXs, address[] playerOs) {

        uint arrayLenght = openGameIds.length;

        gameIds = new uint[](arrayLenght);
        gameStates = new GameState[](arrayLenght);
        gameNames = new bytes32[](arrayLenght);
        owners = new address[](arrayLenght);
        ownerNames = new bytes32[](arrayLenght);
        playerXs = new address[](arrayLenght);
        playerOs = new address[](arrayLenght);

        for (uint i = 0; i < arrayLenght; i++) {
            Game memory game = games[openGameIds[i]];
            gameIds[i] = game.gameId;
            gameStates[i] = game.state;
            gameNames[i] = game.name;
            owners[i] = game.ownerAddr;
            ownerNames[i] = players[game.ownerAddr].name;
            playerXs[i] = game.playerXAddr;
            playerOs[i] = game.playerOAddr;
        }
        return (gameIds, gameStates, gameNames, owners, ownerNames, playerXs, playerOs);
    }

    function getBets() public view returns (uint[] betIds, uint[] gameIds, BetState[] betStates,
        uint[] values, address[] bettorOnXAddr, address[] bettorOnOAddr) {

        uint arrayLenght = openBetIds.length;

        betIds = new uint[](arrayLenght);
        gameIds = new uint[](arrayLenght);
        betStates = new BetState[](arrayLenght);
        values = new uint[](arrayLenght);
        bettorOnXAddr = new address[](arrayLenght);
        bettorOnOAddr = new address[](arrayLenght);

        for (uint i = 0; i < arrayLenght; i++) {
            Bet memory bet = bets[openBetIds[i]];
            betIds[i] = bet.betId;
            gameIds[i] = bet.gameId;
            betStates[i] = bet.state;
            values[i] = bet.value;
            bettorOnXAddr[i] = bet.bettorOnXAddr;
            bettorOnOAddr[i] = bet.bettorOnOAddr;
        }
        return (betIds, gameIds, betStates, values, bettorOnXAddr, bettorOnOAddr);
    }

    event Joined(bool wasSuccess, uint gameId, GameState state, bytes32 playerName, string symbol);
    function joinGame(uint gameId, bytes32 playerName) public {
        Game storage game = games[gameId];

        require(game.state != GameState.NOT_EXISTING, "The game does not exist.");
        require(game.state < GameState.READY, "The game is full.");

        players[msg.sender].name = playerName;

        if (game.state == GameState.EMPTY) {
            game.playerOAddr = msg.sender;
            game.state = GameState.WAITING_FOR_X;

            emit Joined(true, game.gameId, game.state, playerName, "O");
        }
        else if (game.state == GameState.WAITING_FOR_X) {
            require(game.playerOAddr != msg.sender, "Player is already part of this game.");

            game.playerXAddr = msg.sender;
            game.state = GameState.READY;

            emit Joined(true, game.gameId, game.state, playerName, "X");
        }
        else if (game.state == GameState.WAITING_FOR_O) {
            require(game.playerXAddr != msg.sender, "Player is already part of this game.");

            game.playerOAddr = msg.sender;
            game.state = GameState.READY;

            emit Joined(true, game.gameId, game.state, playerName, "O");
        }
    }

    event Left(bool wasSuccess, uint gameId, GameState state, bytes32 playerName, string symbol);
    function leaveGame(uint gameId) public {
        Game storage game = games[gameId];
        require(game.state != GameState.NOT_EXISTING, "The game does not exist.");
        require(game.state <= GameState.READY, "The game is already started.");
        require(game.playerOAddr == msg.sender || game.playerXAddr == msg.sender, "Player is not part of this game.");

        if (game.state == GameState.WAITING_FOR_X && game.playerOAddr == msg.sender) {
            game.playerOAddr = address(0);
            game.state = GameState.EMPTY;
            emit Left(true, game.gameId, game.state, players[msg.sender].name, "O");
        }
        else if (game.state == GameState.WAITING_FOR_O && game.playerXAddr == msg.sender) {
            game.playerXAddr = address(0);
            game.state = GameState.EMPTY;
            emit Left(true, game.gameId, game.state, players[msg.sender].name, "X");
        }
        else if (game.state == GameState.READY && game.playerXAddr == msg.sender) {
            game.playerXAddr = address(0);
            game.state = GameState.WAITING_FOR_X;
            emit Left(true, game.gameId, game.state, players[msg.sender].name, "X");
        }
        else if (game.state == GameState.READY && game.playerOAddr == msg.sender) {
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

        game.state = GameState.X_HAS_TURN;
        emit GameStarted(true, gameId, game.state, "game has been started.");
    }

    function getBoard(uint gameId) public view returns (SquareState[boardSize * boardSize] boardRep) {     // multidimensional arrays cannot be returned easily
        SquareState[boardSize][boardSize] memory board = games[gameId].board;
        uint i = 0;
        for (uint y = 0; y < boardSize; y++) {
            for (uint x = 0; x < boardSize; x++) {
                boardRep[i++] = board[y][x];
            }
        }
        return boardRep;
    }


    /*
    *   during play functions
    */

    event MoveMade(bool success, uint gameId, GameState state, uint x, uint y, string symbol);
    function playMove(uint gameId, uint x, uint y) public {
        Game storage game = games[gameId];

        require(game.state >= GameState.X_HAS_TURN, "The game is not started yet.");
        require(game.state < GameState.WINNER_X, "The game is already finished.");

        game.moveCounter += 1;

        if (game.state == GameState.X_HAS_TURN) {

            require(game.playerXAddr == msg.sender
                    || game.moveCounter == boardSize * boardSize      // last move made automatically
                    , "Sender not equal player X");
            require(game.board[y][x] == SquareState.EMPTY, "Move not possible because the square is not empty.");

            game.board[y][x] = SquareState.X;
            game.state = GameState.O_HAS_TURN;
            checkForWinner(x, y, gameId, game.playerXAddr);

            emit MoveMade(true, gameId, game.state, x, y, "X");
        }
        else {

            require(game.playerOAddr == msg.sender
                    || game.moveCounter == boardSize * boardSize      // last move made automatically
                    , "Sender not equal player O");
            require(game.board[y][x] == SquareState.EMPTY, "Move not possible because the square is not empty.");

            game.board[y][x] = SquareState.O;
            game.state = GameState.X_HAS_TURN;
            checkForWinner(x, y, gameId, game.playerOAddr);

            emit MoveMade(true, gameId, game.state, x, y, "O");
        }

        if (game.moveCounter == boardSize * boardSize - 1 && game.state < GameState.WINNER_X) {
            doLastMoveAutomatically(game);
        }
    }

    function doLastMoveAutomatically(Game game) private {
        for (uint y = 0; y < boardSize; y++) {
            for (uint x = 0; x < boardSize; x++) {
                if (game.board[y][x] == SquareState.EMPTY) {
                    playMove(game.gameId, x, y);
                    return;
                }
            }
        }
    }

    function checkForWinner(uint x, uint y, uint gameId, address currentPlayer) private {
        Game storage game = games[gameId];

        //is winning already possible?
        if (game.moveCounter < 2 * boardSize - 1) {
            return;
        }

        SquareState[boardSize][boardSize] memory board = game.board;
        SquareState symbol = game.board[y][x];

        //check column
        for (uint i = 0; i < boardSize; i++) {
            if (board[i][x] != symbol) {
                break;
            }
            else if (i == (boardSize - 1)) {
                game.winnerAddr = currentPlayer;
                game.state = getGameState(symbol);
                payoutBets(game.gameId);
                return;
            }
        }

        //check row
        for (i = 0; i < boardSize; i++) {
            if (board[y][i] != symbol) {
                break;
            }
            else if (i == (boardSize - 1)) {
                game.winnerAddr = currentPlayer;
                game.state = getGameState(symbol);
                payoutBets(game.gameId);
                return;
            }
        }

        //check diagonal
        if (x == y) {
            for (i = 0; i < boardSize; i++) {
                if (board[i][i] != symbol) {
                    break;
                }
                else if (i == (boardSize - 1)) {
                    game.winnerAddr = currentPlayer;
                    game.state = getGameState(symbol);
                    payoutBets(game.gameId);
                    return;
                }
            }
        }

        // check anti diagonal
        if (x + y == (boardSize - 1)) {
            for (i = 0; i < boardSize; i++) {
                if (board[x][boardSize - 1 - i] != symbol) {//!equalStrings(board[x][(boardSize-1) - 1], symbol)) {
                    break;
                }
                else if (i == (boardSize - 1)) {
                    game.winnerAddr = currentPlayer;
                    game.state = getGameState(symbol);
                    payoutBets(game.gameId);
                    return;
                }
            }
        }

        //check for draw
        if (game.moveCounter == boardSize * boardSize) {
            game.state = GameState.DRAW;
        }
    }

    function getGameState(SquareState symbol) private pure returns (GameState state) {
        if (symbol == SquareState.X)
            return GameState.WINNER_X;
        else
            return GameState.WINNER_O;
    }



    /*
    *   bet functions
    */

    event BetCreated(bool wasSuccess, uint betId, BetState state, string message);
    function createBet(uint gameId, bool bettingOnX) public payable {

        require(games[gameId].state >= GameState.EMPTY, "The game does not exist.");
        require(games[gameId].state < GameState.WINNER_X, "The game is already finished.");

        uint betId = betCounter++;
        Bet storage myBet = bets[betId];

        myBet.betId = betId;
        myBet.gameId = gameId;
        myBet.value = msg.value;

        // saving bettor
        if (bettingOnX) {
            myBet.bettorOnXAddr = msg.sender;
            myBet.state = BetState.MISSING_O_BETTOR;
        } else {
            myBet.bettorOnOAddr = msg.sender;
            myBet.state = BetState.MISSING_X_BETTOR;
        }

        openBetIds.push(betId);

        emit BetCreated(true, betId, myBet.state, "Bet created");
    }

    function getBetIds() public view returns (uint[] betIds) {
        return openBetIds;
    }

    event JoinedBet(bool wasSuccess, uint betId, BetState state, string symbol);
    function joinBet(uint betId) payable public {

        Bet storage bet = bets[betId];

        require(bet.state != BetState.NOT_EXISTING, "The bet does not exist.");
        require(bet.state < BetState.WITHDRAWN, "Not possible to join this bet.");

        require(msg.value == bet.value, "Not equal amount of value.");
        require(games[bet.gameId].state < GameState.WINNER_X, "Game is already finished.");

        if (bet.state == BetState.MISSING_X_BETTOR) {
            require(bet.bettorOnOAddr != msg.sender, "Same address on both sides.");
            bet.bettorOnXAddr = msg.sender;
        } else {
            require(bet.bettorOnXAddr != msg.sender, "Same address on both sides.");
            bet.bettorOnOAddr = msg.sender;
        }
        bet.state = BetState.FIXED;
        emit JoinedBet(true, betId, bet.state, "Joined Bet");
    }

    function withdrawBet(uint betId) public {
        Bet storage bet = bets[betId];

        require(bet.state != BetState.NOT_EXISTING
                && bet.state != BetState.WITHDRAWN
                , "The bet does not exist.");
        require(bet.state == BetState.MISSING_X_BETTOR
                || bet.state == BetState.MISSING_O_BETTOR
                , "Bet is already fixed. Someone already joined.");

        require(msg.sender == bet.bettorOnXAddr
                || msg.sender == bet.bettorOnOAddr
                , "Only the owner can withdraw his bet.");

        if (msg.sender == bet.bettorOnXAddr) {
            (bet.bettorOnXAddr).transfer(bet.value);
        }
        else {
            (bet.bettorOnOAddr).transfer(bet.value);
        }

        bet.state = BetState.WITHDRAWN;
    }

    function payoutBets(uint gameId) internal {
        for (uint i = 0; i < openBetIds.length; i++) {

            Bet storage iBet = bets[openBetIds[i]];

            if (iBet.gameId == gameId) {

                if (iBet.state == BetState.FIXED) {

                    // bettorOnX wins
                    if (games[gameId].state == GameState.WINNER_X) {
                        (iBet.bettorOnXAddr).transfer(SafeMath.mul(2, iBet.value));

                    // bettorOnO wins
                    } else if (games[gameId].state == GameState.WINNER_O) {
                        (iBet.bettorOnOAddr).transfer(SafeMath.mul(2, iBet.value));

                    // draw
                    } else {
                        (iBet.bettorOnOAddr).transfer(iBet.value);
                        (iBet.bettorOnXAddr).transfer(iBet.value);
                    }
                    iBet.state = BetState.PAYEDOUT;
                }

                // handle not fixed games: transfer value back to owner
                if (iBet.state == BetState.MISSING_O_BETTOR) {
                    (iBet.bettorOnXAddr).transfer(iBet.value);
                    iBet.state = BetState.WITHDRAWN;
                }
                if (iBet.state == BetState.MISSING_X_BETTOR) {
                    (iBet.bettorOnOAddr).transfer(iBet.value);
                    iBet.state = BetState.WITHDRAWN;
                }
            }
        }
    }
}

/*
*   using SafeMath for proper value calculations
*/
//using: https://github.com/OpenZeppelin/openzeppelin-solidity/blob/c63b203c1d1800c9a8b5f51f0b444187fdc6c185/contracts/math/SafeMath.sol
library SafeMath {

    /**
    * @dev Multiplies two numbers, throws on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        if (a == 0) {
            return 0;
        }
        c = a * b;
        assert(c / a == b);
        return c;
    }

    /**
    * @dev Integer division of two numbers, truncating the quotient.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        // uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return a / b;
    }

    /**
    * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    /**
    * @dev Adds two numbers, throws on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }
}