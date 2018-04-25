const ContractProps = {
  CONTRACT_ABI: [
    {
      constant: true,
      inputs: [
        {
          name: 'gameId',
          type: 'uint256'
        }
      ],
      name: 'getBoard',
      outputs: [
        {
          name: 'boardAsString',
          type: 'string'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'gameId',
          type: 'uint256'
        },
        {
          name: 'playerName',
          type: 'string'
        }
      ],
      name: 'joinGame',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: 'gameId',
          type: 'uint256'
        }
      ],
      name: 'isGameFinished',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'x',
          type: 'uint256'
        },
        {
          name: 'y',
          type: 'uint256'
        },
        {
          name: 'gameId',
          type: 'uint256'
        }
      ],
      name: 'playMove',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'getOpenGameIds',
      outputs: [
        {
          name: 'gameIds',
          type: 'uint256[]'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'gameName',
          type: 'string'
        },
        {
          name: 'playerName',
          type: 'string'
        }
      ],
      name: 'createGame',
      outputs: [
        {
          name: 'gameId',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'gameId',
          type: 'uint256'
        }
      ],
      name: 'startGame',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'ID',
          type: 'uint256'
        },
        {
          indexed: false,
          name: 'returnValue',
          type: 'bool'
        }
      ],
      name: 'SuccessEvent',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'symbol',
          type: 'string'
        },
        {
          indexed: false,
          name: 'returnValue',
          type: 'bool'
        }
      ],
      name: 'Joined',
      type: 'event'
    }
  ],

  CONTRACT_ADDRESS: '0x41c195BD70e3376133bFa1bB0691D2e1428D4D16'
};

export default ContractProps;