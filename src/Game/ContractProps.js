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
          "name": "isStarted",
          "type": "bool"
        },
        {
          "name": "isFinished",
          "type": "bool"
        },
        {
          "name": "moveCounter",
          "type": "uint256"
        },
        {
          "name": "isPlayerOSet",
          "type": "bool"
        },
        {
          "name": "playerOAddr",
          "type": "address"
        },
        {
          "name": "isPlayerXSet",
          "type": "bool"
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
          "name": "isBettorOSet",
          "type": "bool"
        },
        {
          "name": "bettorOnOAddr",
          "type": "address"
        },
        {
          "name": "isBettorXSet",
          "type": "bool"
        },
        {
          "name": "bettorOnXAddr",
          "type": "address"
        },
        {
          "name": "isBetFilled",
          "type": "bool"
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
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "getBoard",
      "outputs": [
        {
          "name": "boardAsString",
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
        },
        {
          "name": "playerName",
          "type": "string"
        }
      ],
      "name": "joinGame",
      "outputs": [
        {
          "name": "",
          "type": "bool"
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
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "isGameFinished",
      "outputs": [
        {
          "name": "",
          "type": "bool"
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
          "name": "x",
          "type": "uint256"
        },
        {
          "name": "y",
          "type": "uint256"
        },
        {
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "playMove",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getOpenGameIds",
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
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getOpenGames",
      "outputs": [
        {
          "name": "gameIds",
          "type": "uint256[]"
        },
        {
          "name": "gameNames",
          "type": "string[]"
        },
        {
          "name": "ownerNames",
          "type": "string[]"
        },
        {
          "name": "playerO",
          "type": "string[]"
        },
        {
          "name": "playerX",
          "type": "string[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
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
          "name": "ID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "returnValue",
          "type": "bool"
        }
      ],
      "name": "SuccessEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gameId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "symbol",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "returnValue",
          "type": "bool"
        }
      ],
      "name": "Joined",
      "type": "event"
    }
  ],

  CONTRACT_ADDRESS: '0xc6ce45fd3272e9b8285cc43299746a9cadcc1cc8'
};

export default ContractProps;