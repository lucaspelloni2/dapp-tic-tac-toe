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
import StatusRender from './Game/StatusRender';

let web3 = window.web3;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class App extends Component {
  constructor() {
    super();
    let CONTRACT_ADDRESS;
    let web3Instance = null;
    if (typeof web3 !== 'undefined') {
      this.web3Provider = web3.currentProvider;
      web3Instance = new Web3(web3.currentProvider);
      // metamask
      CONTRACT_ADDRESS = ContractProps.METAMASK_CONTRACT_ADDRESS;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      );

      web3Instance = new Web3(this.web3Provider);
      CONTRACT_ADDRESS = ContractProps.LOCALHOST_CONTRACT_ADDRESS;
    }

    const tictactoeContract = new web3Instance.eth.Contract(
      ContractProps.CONTRACT_ABI,
      CONTRACT_ADDRESS
    );

    console.log('This is your provider ', tictactoeContract);

    this.state = {
      account: {
        ethAddress: '',
        ethBalance: 0
      },
      web3: web3Instance,
      contract: tictactoeContract,
      games: [],
      gamesLoading: true
    };
  }

  async componentDidMount() {
    await Promise.all([this.getUserAccount()]);
    await this.fetchGames();
    // this.interval = setInterval(async () => {
    //   // if (!this.isSomeGameLoading()) {
    //     await this.fetchGames();
    //     console.log('fetching games..');
    //   // }
    // }, 1200);
  }

  fetchGames() {
    let games = [];
    return this.state.contract.methods
      .getGames()
      .call({from: this.state.account.ethAddress})
      .then(res => {
        for (let i = 0; i < res.gameIds.length; i++) {
          let game = this.createGame(res, i);
          if (game !== null) {
            games.push(game);
          }
        }
        this.setState({games: games, gamesLoading: false});
      })
      .catch(err => {
        console.log('error getting games ' + err);
      });
  }

  isSomeGameLoading() {
    let isSomeLoading = false;
    this.state.games.forEach(game => {
      if (game.isLoading) {
        isSomeLoading = true;
      }
    });
    return isSomeLoading;
  }

  createGame(res, i) {
    let game = null;
    let owner = res.owners[i];
    let playerX = res.playerXs[i];
    let playerO = res.playerOs[i];
    let status = res.gameStates[i];
    if (
      //status === '1' ||
      status === '2' ||
      status === '3' ||
      status === '4' ||
      status === '5' ||
      status === '6'
    ) {
      game = {
        id: res.gameIds[i],
        status: StatusRender.renderStatus(status), //JoinGame.renderStatus(status),
        name: this.hexToAscii(res.gameNames[i]),
        owner,
        ownerName: this.hexToAscii(res.ownerNames[i]),
        isLoading: false,
        playerX,
        playerO
      };
    }

    return game;
  }

  hexToAscii(byte32) {
    return this.state.web3.utils.hexToAscii(byte32).replace(/\u0000/g, '');
  }

  getUserAccount() {
    return this.state.web3.eth
      .getAccounts()
      .then(addresses => {
        let address = addresses[0];
        console.log(address);

        let account = Object.assign({}, this.state.account);
        account.ethAddress = address;
        this.setState({account: account});
        return this.state.web3.eth
          .getBalance(address.toString())
          .then(bal => {
            let inEth = this.state.web3.utils.fromWei(bal, 'ether');
            let account = Object.assign({}, this.state.account);
            account.ethBalance = inEth;
            this.setState({account: account});
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
      <Context.Provider value={this.state.account}>
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
                      account={this.state.account}
                      games={this.state.games}
                      gamesLoading={this.state.gamesLoading}
                      web3={this.state.web3}
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
                      account={this.state.account}
                      games={this.state.games}
                      gamesLoading={this.state.gamesLoading}
                      setLoading={async (game, isLoading) => {
                        this.setState({
                          games: this.state.games.map(g => {
                            if (game.id === g.id) {
                              return Object.assign({}, game, {
                                isLoading: isLoading
                              });
                            }
                            return g;
                          })
                        });
                        if (!isLoading) {
                          await this.fetchGames();
                          console.log('fetching games..');
                        }
                      }}
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
                      account={this.state.account}
                      fetchGames={async () => {
                        await this.fetchGames();
                      }}
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
                      account={this.state.account}
                      games={this.state.games}
                      gamesLoading={this.state.gamesLoading}
                      updateUserAccount={async () => {
                        await this.getUserAccount();
                      }}
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
                      account={this.state.account}
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
