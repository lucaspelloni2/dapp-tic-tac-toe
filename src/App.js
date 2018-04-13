import React, {Component, createContext} from 'react';
import {Switch, Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import styled from 'styled-components';
import Login from './Game/login';
import './App.css';
import Context from './Game/Context';
import Web3 from 'web3';
import WelcomePage from './Game/WelcomePage';
let web3 = window.web3;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class App extends Component {
  constructor() {
    super();
    this.state = {ethAddress: '', ethBalance: 0};
  }

  componentDidMount() {
    this.initWeb3();
    this.getGames();
  }

  getUserAccount() {
    web3.eth
      .getAccounts()
      .then(addr => {
        this.setState({ethAddress: addr.toString()});
        web3.eth
          .getBalance(addr.toString())
          .then(bal => {
            var inEth = web3.utils.fromWei(bal, "ether");
            this.setState({ethBalance: inEth});
          })
          .catch(err => {
            console.log('error getting balance' + err);
          });
      })
      .catch(err => {
        console.log('error getting address ' + err);
      });
  }

  getGames() {
    var contractABI = [
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
    ];
    var myContract = new web3.eth.Contract(contractABI, '0x41c195BD70e3376133bFa1bB0691D2e1428D4D16');

    console.log(myContract.methods.getOpenGameIds().call({from: this.state.ethAddress}));
  }

  initWeb3() {
    if (typeof web3 !== 'undefined') {
      this.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      console.log('existing web3: provider ' + web3.currentProvider);
    } else {
      this.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:8545'
      );
      web3 = new Web3(this.web3Provider);
      console.log('new web3');
    }
    this.getUserAccount();
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        <Container>
          <BrowserRouter>
            <div>
              <Switch>
                <Route path="/login" exact component={Login} />
                <Route path="/" exact component={WelcomePage} />
              </Switch>
            </div>
          </BrowserRouter>
        </Container>
      </Context.Provider>
    );
  }
}

export default App;
