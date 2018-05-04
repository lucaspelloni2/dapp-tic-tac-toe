import React, {Component} from 'react';
import styled from 'styled-components';
import MetaMaskLogo from './MetamaskLogo';
import Spinner from './Spinner';
import MyTransactions from './MyTransactions';
import Transaction from './Transaction';
import Status from './Status';
import ArrowWithPath from './ArrowWithPath';
import GameIcon from './GameIcon';
import {Redirect} from 'react-router';
import StatusRender from './StatusRender';
import GAME_STATUS from './GameStatus';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const GamesContainer = styled.div`
  width: 700px;
  border: 1px solid transparent;
  box-shadow: 0 0 15px 3px rgba(168, 221, 224, 0.5);
  border-radius: 3px;
  padding: 1em;
  max-height: 400px;
  overflow: scroll;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #e2751b 0,
    #016999 1200px
  );
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-right: -2em;
`;

const GameId = styled.p`
  font-size: 22px;
  font-weight: bold;
`;

const Table = styled.table`
  width: 100%;
  text-align: center;
`;
const Title = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

const JoinParagraph = styled.p`
  margin-bottom: 0;
  margin-top: -12px;
  font-size: 16px;
  font-weight: bold;

  letter-spacing: 3px;
`;

const Button = styled.div`
  &:hover {
    border: 2px solid ${props => props.hoverColor};
  }
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 0 0 3px 3px rgba(168, 221, 224, 0.5);
  border-radius: 18px;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease-out;
  margin-left: 1em;
`;

const ParentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const StatusContainer = styled.div`
  border: 1px solid ${props => (props.border ? props.border : props.color)};
  border-radius: 4px;
  padding: 4px;
  background-image: radial-gradient(
    farthest-side at 212% 174px,
    #0177a2 0,
    ${props => props.color} 1200px
  );
`;

class JoinGame extends Component {
  constructor() {
    super();
    this.state = {
      games: [],
      receivedGame: null,
      loading: true
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData() {
    let games = this.state.games;
    this.props.contract.methods
      .getGames()
      .call({from: this.props.account.ethAddress})
      .then(res => {
        for (let i = 0; i < res.gameIds.length; i++) {
          let game = this.createGame(res, i);
          if (game !== null) {
            games.push(game);
          }
        }
        this.setState({games: games, loading: false});
      })
      .catch(err => {
        console.log('error getting games ' + err);
      });
  }

  createGame(res, i) {
    let game = null;
    let owner = res.owners[i];
    let playerX = res.playerXs[i];
    let playerO = res.playerOs[i];
    let status = res.gameStates[i];
    if (
      status === '1' ||
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
    return this.props.web3.utils.hexToAscii(byte32).replace(/\u0000/g, '');
  }

  joinGame(game, playerName) {
    this.props.contract.methods
      .joinGame(game.id, this.props.web3.utils.fromAscii(playerName))
      .send({from: this.props.account.ethAddress})
      .on('transactionHash', tx => {
        this.addNewTx(tx, game.id, Status.GAME_JOINED);
        this.setLoadingToTrue(game);
      })
      .on('receipt', res => {
        const returnValues = res.events.Joined.returnValues;
        if (res.status === '0x1') {
          console.log(
            this.props.web3.utils.toAscii(returnValues.playerName) +
              ' joined game ' +
              returnValues.gameId +
              ' and has symbol ' +
              returnValues.symbol
          );

          this.setState({games: [], loading: true});
          this.fetchData();
        } else {
          console.log('not possible to join');
        }
      })
      .on('confirmation', function(confirmationNr) {
        // is returned for the first 24 block confirmations
        //console.log('new game joined ' + confirmationNr);
      });
  }

  startGame(game) {
    this.props.contract.methods
      .startGame(game.id)
      .send({from: this.props.account.ethAddress})
      .on('transactionHash', tx => {
        this.addNewTx(tx, game.id, Status.GAME_STARTED);
        this.setLoadingToTrue(game);
      })
      .on('receipt', res => {
        console.log(res);
        if (res.status === '0x1') {
          console.log('game started successfully');
          // this.setState({games: [], loading: true});
          // this.fetchData();
          this.setState({receivedGame: game});
        } else {
          console.log('not possible to start game');
        }
      })
      .on('confirmation', function(confirmationNr) {
        // is returned for the first 24 block confirmations
        //console.log('new game joined ' + confirmationNr);
      });
  }

  playGame(game) {
    this.setState({receivedGame: game});
  }

  setLoadingToTrue(game) {
    this.state.games.forEach(g => {
      if (game.id === g.id) {
        g.isLoading = true;
      }
    });
    this.setState({games: this.state.games});
  }

  getJoiningStatus(game) {
    if (!game.isLoading) {
      return this.getButton(game);
    } else {
      return (
        <SpinnerContainer>
          <Spinner width={30} height={30} />
        </SpinnerContainer>
      );
    }
  }

  renderStartButton(game, text) {
    return (
      <Button
        hoverColor={'#02ff31'}
        onClick={() => {
          this.startGame(game);
        }}
      >
        <GameIcon icon={'play'} />
        <JoinParagraph>{text}</JoinParagraph>
      </Button>
    );
  }

  renderJoinButton(game, text) {
    return (
      <Button
        hoverColor={'#e4751b'}
        onClick={() => {
          this.joinGame(game, localStorage.getItem('username'));
        }}
      >
        <GameIcon icon={'join'} />
        <JoinParagraph>{text}</JoinParagraph>
      </Button>
    );
  }

  renderBetButton(game, text) {
    // TODO: implement BET CALLS
    return (
      <Button
        hoverColor={'#03b8d4'}
        onClick={() => {
          this.playGame(game);
        }}
      >
        <GameIcon icon={'bet'} />
        <JoinParagraph>{text}</JoinParagraph>
      </Button>
    );
  }

  getButton(game) {
    if (game.status === GAME_STATUS.READY) {
      if (game.owner === this.props.account.ethAddress) {
        return this.renderStartButton(game, 'Start');
      } else {
        return this.renderBetButton(game, 'Bet');
      }
    }

    if (
      game.status === GAME_STATUS.X_HAS_TURN ||
      game.status === GAME_STATUS.O_HAS_TURN
    )
      if (
        game.playerX === this.props.account.ethAddress ||
        game.playerO === this.props.account.ethAddress
      )
        return this.renderBetButton(game, 'Play/Bet');
      else return this.renderBetButton(game, 'Bet');

    if (game.status === 'WAITING_FOR_X' || game.status === 'WAITING_FOR_O')
      return this.renderJoinButton(game, 'Join');
  }

  getGameStatus(status) {
    switch (status) {
      case GAME_STATUS.READY:
        return <StatusContainer color={'#00ff31'}>{status}</StatusContainer>;
      case GAME_STATUS.WAITING_FOR_O:
        return <StatusContainer color={'#02b8d4'}>{status}</StatusContainer>;
      case GAME_STATUS.WAITING_FOR_X:
        return <StatusContainer color={'#02b8d4'}>{status}</StatusContainer>;
      case GAME_STATUS.X_HAS_TURN:
        return (
          <StatusContainer color={'#9c2a2a'} border={'#03b8d4'}>
            {status}
          </StatusContainer>
        );
      case GAME_STATUS.O_HAS_TURN:
        return (
          <StatusContainer color={'#9c2a2a'} border={'#03b8d4'}>
            {status}
          </StatusContainer>
        );
      default:
        return <StatusContainer color={'#d42517'}>default</StatusContainer>;
    }
  }

  addNewTx(tx, gameId, status) {
    let transaction = new Transaction({
      tx: tx,
      confirmed: false,
      gameName: gameId,
      blockNumber: null,
      status
    });
    let transactions = JSON.parse(localStorage.getItem('txs'));
    transactions.unshift(transaction);
    localStorage.setItem('txs', JSON.stringify(transactions));
  }

  render() {
    return (
      <div>
        <div>
          {this.state.receivedGame ? (
            <Redirect
              to={`/games/${this.props.account.ethAddress}/${
                this.state.receivedGame.id
              }`}
            />
          ) : null}
        </div>
        <div>
          <MetaMaskLogo />
          <ParentContainer>
            <Container>
              <h1>List of available Games</h1>
              <GamesContainer>
                {this.state.loading ? (
                  <SpinnerContainer>
                    <Spinner width={60} height={60} />
                  </SpinnerContainer>
                ) : null}
                <Table>
                  <tbody>
                    <tr>
                      <th>
                        <Title>Game Id</Title>
                      </th>
                      <th>
                        <Title>Game name</Title>
                      </th>
                      <th>
                        <Title>Owner</Title>
                      </th>
                      <th>
                        <Title>Status</Title>
                      </th>
                      <th />
                    </tr>
                  </tbody>
                  <tbody>
                    {this.state.games.map(game => (
                      <tr key={game.id}>
                        <td>
                          <GameId>{game.id}</GameId>
                        </td>
                        <td>{game.name}</td>
                        <td>
                          <a
                            style={{marginRight: 10}}
                            href={
                              'https://ropsten.etherscan.io/address/' +
                              game.owner
                            }
                            target="_blank"
                          >
                            {game.ownerName}
                          </a>
                        </td>
                        <td>{this.getGameStatus(game.status)}</td>
                        <td style={{width: 120}}>
                          {this.getJoiningStatus(game, game.joiningStatus)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </GamesContainer>
            </Container>
            <MyTransactions marginTop={5} web3={this.props.web3} />
          </ParentContainer>

          <ArrowWithPath
            top={50}
            location={'/games/' + this.props.account.ethAddress}
          >
            Create a game!
          </ArrowWithPath>
        </div>
      </div>
    );
  }
}

export default JoinGame;
