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
import GameScreen from './Game/GameScreen';
import StatusRender from './Game/StatusRender';
import GameSpinner from './Game/GameSpinner';
import Web3Providers from './Game/Web3Providers';

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
    let provider;
    if (typeof web3 !== 'undefined') {
      this.web3Provider = web3.currentProvider;
      web3Instance = new Web3(web3.currentProvider);
      // metamask
      CONTRACT_ADDRESS = ContractProps.METAMASK_CONTRACT_ADDRESS;
      provider = Web3Providers.META_MASK;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      );

      web3Instance = new Web3(this.web3Provider);
      CONTRACT_ADDRESS = ContractProps.LOCALHOST_CONTRACT_ADDRESS;
      provider = Web3Providers.LOCALHOST;
    }

    const tictactoeContract = new web3Instance.eth.Contract(
      ContractProps.CONTRACT_ABI,
      CONTRACT_ADDRESS
    );

    this.state = {
      account: {
        ethAddress: '',
        ethBalance: 0
      },
      web3: web3Instance,
      contract: tictactoeContract,
      games: [],
      addresses: [],
      selectedAddress: null,
      gamesLoading: true,
      userLoading: true,
      provider: provider
    };
  }

  async componentDidMount() {
    let addresses = await this.getUserAddresses();
    this.setState({addresses: addresses});
    await this.fetchUserInfo();
    await this.fetchGames();
  }

  async fetchUserInfo(address) {
    if (!address) {
      address = this.state.addresses[0];
    }
    let account = Object.assign({}, this.state.account);
    account.ethAddress = address;
    this.setState({account: account});
    await this.getUserBalance(address);
    this.setState({userLoading: false});
  }

  fetchGames() {
    let games = [];
    return this.state.contract.methods
      .getGames()
      .call({from: this.state.account.ethAddress})
      .then(res => {
        for (let i = res.gameIds.length - 1; i >= 0; i--) {
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

  getUserAddresses() {
    return this.state.web3.eth
      .getAccounts()
      .then(addresses => {
        return addresses;
      })
      .catch(err => {
        console.log('error getting address ' + err);
      });
  }

  getUserBalance(address) {
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
  }

  render() {
    return (
      <div>
        {this.state.userLoading ? (
          <GameSpinner />
        ) : (
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
                          addresses={this.state.addresses}
                          updateUserAccount={async selectedAddress => {
                            await this.fetchUserInfo(selectedAddress);
                          }}
                          provider={this.state.provider}
                        />
                      )}
                    />
                    <Route
                      path="/login"
                      exact
                      render={props => (
                        <Login
                          {...props}
                          account={this.state.account}
                          addresses={this.state.addresses}
                          updateUserAccount={async selectedAddress => {
                            await this.fetchUserInfo(selectedAddress);
                          }}
                          provider={this.state.provider}
                        />
                      )}
                    />
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
                          addresses={this.state.addresses}
                          updateUserAccount={async selectedAddress => {
                            await this.fetchUserInfo(selectedAddress);
                          }}
                          provider={this.state.provider}
                        />
                      )}
                    />
                    <Route
                      path="/games/create"
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
                          addresses={this.state.addresses}
                          updateUserAccount={async selectedAddress => {
                            await this.fetchUserInfo(selectedAddress);
                          }}
                          provider={this.state.provider}
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
                          addresses={this.state.addresses}
                          updateUserAccount={async selectedAddress => {
                            await this.fetchUserInfo(selectedAddress);
                          }}
                          provider={this.state.provider}
                        />
                      )}
                    />
                    <Route path="/" exact component={WelcomePage} />
                  </Switch>
                </div>
              </BrowserRouter>
            </Container>
          </Context.Provider>
        )}
      </div>
    );
  }
}

export default App;
