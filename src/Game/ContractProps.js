const ContractProps = {
  CONTRACT_ABI: [
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "games",
      "outputs": [
        {
          "name": "gameId",
          "type": "uint256"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "ownerAddr",
          "type": "address"
        },
        {
          "name": "state",
          "type": "uint8"
        },
        {
          "name": "moveCounter",
          "type": "uint256"
        },
        {
          "name": "playerOAddr",
          "type": "address"
        },
        {
          "name": "playerXAddr",
          "type": "address"
        },
        {
          "name": "winnerAddr",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "bets",
      "outputs": [
        {
          "name": "value",
          "type": "uint256"
        },
        {
          "name": "gameId",
          "type": "uint256"
        },
        {
          "name": "state",
          "type": "uint8"
        },
        {
          "name": "bettorOnOAddr",
          "type": "address"
        },
        {
          "name": "bettorOnXAddr",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "leaveGame",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "getBoard",
      "outputs": [
        {
          "name": "",
          "type": "uint8[9]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameId",
          "type": "uint256"
        },
        {
          "name": "playerName",
          "type": "string"
        }
      ],
      "name": "joinGame",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameId",
          "type": "uint256"
        },
        {
          "name": "x",
          "type": "uint256"
        },
        {
          "name": "y",
          "type": "uint256"
        }
      ],
      "name": "playMove",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getGameIds",
      "outputs": [
        {
          "name": "gameIds",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getGames",
      "outputs": [
        {
          "name": "gameIds",
          "type": "uint256[]"
        },
        {
          "name": "gameStates",
          "type": "uint8[]"
        },
        {
          "name": "owners",
          "type": "address[]"
        },
        {
          "name": "playerXs",
          "type": "address[]"
        },
        {
          "name": "playerOs",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameName",
          "type": "string"
        },
        {
          "name": "playerName",
          "type": "string"
        }
      ],
      "name": "createGame",
      "outputs": [
        {
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "players",
      "outputs": [
        {
          "name": "name",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "startGame",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "wasSuccess",
          "type": "bool"
        },
        {
          "indexed": false,
          "name": "gameId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "state",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "message",
          "type": "string"
        }
      ],
      "name": "GameCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "wasSuccess",
          "type": "bool"
        },
        {
          "indexed": false,
          "name": "gameId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "state",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "playerName",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "symbol",
          "type": "string"
        }
      ],
      "name": "Joined",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "wasSuccess",
          "type": "bool"
        },
        {
          "indexed": false,
          "name": "gameId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "state",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "playerName",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "symbol",
          "type": "string"
        }
      ],
      "name": "Left",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "wasSuccess",
          "type": "bool"
        },
        {
          "indexed": false,
          "name": "gameId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "state",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "message",
          "type": "string"
        }
      ],
      "name": "GameStarted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "success",
          "type": "bool"
        },
        {
          "indexed": false,
          "name": "gameId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "state",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "x",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "y",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "symbol",
          "type": "string"
        }
      ],
      "name": "MoveMade",
      "type": "event"
    }
  ],

  CONTRACT_ADDRESS: '0x3Ef591C2a47F7d3E2f4D16A9F791df7B29E5a3C4'
};

export default ContractProps;