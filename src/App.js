import React, {Component, createContext} from 'react';
import {Switch, Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import styled from 'styled-components';
import Login from './Game/login';
import './App.css';
import Context from './Game/Context';
import Web3 from 'web3';
import WelcomePage from './Game/WelcomePage';
import Lobby from './Game/lobby';
import ContractProps from './Game/ContractProps';
import JoinGame from './Game/JoinGame';
import CreateGame from './Game/CreateGame';
import GameBoard from './Game/GameBoard/GameBoard';
import GameScreen from './Game/GameScreen';

let web3 = window.web3;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class App extends Component {
  constructor() {
    super();
    let web3Instance = null;
    if (typeof web3 !== 'undefined') {
      this.web3Provider = web3.currentProvider;
      web3Instance = new Web3(web3.currentProvider);
    } else {
      this.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:8545'
      );
      web3Instance = new Web3(this.web3Provider);
      console.log('new web3');
    }
    const tictactoeContract = new web3Instance.eth.Contract(
      ContractProps.CONTRACT_ABI,
      ContractProps.CONTRACT_ADDRESS
    );

    this.state = {
      ethAddress: '',
      ethBalance: 0,
      web3: web3Instance,
      contract: tictactoeContract
    };
    this.getUserAccount();
  }

  getUserAccount() {
    this.state.web3.eth
      .getAccounts()
      .then(addr => {
        this.setState({ethAddress: addr.toString()});
        this.state.web3.eth
          .getBalance(addr.toString())
          .then(bal => {
            let inEth = this.state.web3.utils.fromWei(bal, 'ether');
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

  render() {
    return (
      <Context.Provider value={this.state}>
        <Container>
          <BrowserRouter>
            <div>
              <Switch>
                <Route
                  path="/lobby"
                  exact
                  render={props => (
                    <Lobby
                      {...props}
                      contract={this.state.contract}
                      account={this.state}
                    />
                  )}
                />
                <Route path="/login" exact component={Login} />
                <Route
                  path="/games"
                  exact
                  render={props => (
                    <JoinGame
                      {...props}
                      web3={this.state.web3}
                      contract={this.state.contract}
                      account={this.state}
                    />
                  )}
                />
                <Route
                  path="/games/:address"
                  exact
                  render={props => (
                    <CreateGame
                      {...props}
                      web3={this.state.web3}
                      contract={this.state.contract}
                      account={this.state}
                    />
                  )}
                />
                <Route
                  path="/games/:address/:gameId"
                  exact
                  render={props => (
                    <GameScreen
                      {...props}
                      web3={this.state.web3}
                      contract={this.state.contract}
                      account={this.state}
                    />
                  )}
                />
                <Route
                  // path="/games/:address/:gameId"
                  path="/board"
                  exact
                  render={props => (
                    <GameBoard
                      {...props}
                      web3={this.state.web3}
                      contract={this.state.contract}
                      account={this.state}
                    />
                  )}
                />
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
