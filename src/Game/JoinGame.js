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
import Gas from './Gas';
import Header from './Header';

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

const BellText = styled.p`
  margin: 0;
`;

const BellContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: #02ff31;
  border-bottom: 4px solid #02d4a5;
`;

class JoinGame extends Component {
  constructor() {
    super();
    this.state = {
      receivedGame: null,
      createGameName: null
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const createdGameName = params.get('gameName');

    if (createdGameName) {
      this.setState({createdGameName: createdGameName});
    }
  }

  async joinGame(game, playerName) {
    const gasAmount = await this.props.contract.methods
      .joinGame(game.id, this.props.web3.utils.fromAscii(playerName)
      ).estimateGas({from: this.props.account.ethAddress});

    this.props.contract.methods
      .joinGame(game.id, this.props.web3.utils.fromAscii(playerName))
      .send({
        from: this.props.account.ethAddress,
        gas: gasAmount
      })
      .on('transactionHash', tx => {
        this.addNewTx(tx, game.id, Status.GAME_JOINED);
        this.props.setLoading(game, true);
      })
      .on('receipt', res => {
        this.props.setLoading(game, false);
        const returnValues = res.events.Joined.returnValues;
        let isSuccess =
          res.status.toString().includes('0x01') || res.status === '0x1'; // for private testnet || for metamask
        if (isSuccess) {
          console.log(
            this.props.web3.utils.toAscii(returnValues.playerName) +
              ' joined game ' +
              returnValues.gameId +
              ' and has symbol ' +
              returnValues.symbol
          );
        } else {
          console.log('not possible to join');
        }
      })
      .on('confirmation', function(confirmationNr) {
        // is returned for the first 24 block confirmations
        //console.log('new game joined ' + confirmationNr);
      });
  }

  async startGame(game) {
    const gasAmount = await this.props.contract.methods
      .startGame(game.id)
      .estimateGas({from: this.props.account.ethAddress});

    this.props.contract.methods
      .startGame(game.id)
      .send({
        from: this.props.account.ethAddress,
        gas: gasAmount
      })
      .on('transactionHash', tx => {
        this.addNewTx(tx, game.id, Status.GAME_STARTED);
        this.props.setLoading(game, true);
      })
      .on('receipt', res => {
        this.props.setLoading(game, false);
        let isSuccess =
          res.status.toString().includes('0x01') || res.status === '0x1'; // for private testnet || for metamask
        if (isSuccess) {
          console.log('game started successfully');
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

    if (game.status === GAME_STATUS.WAITING_FOR_X || game.status === GAME_STATUS.WAITING_FOR_O)
      if (
        game.playerX === this.props.account.ethAddress ||
        game.playerO === this.props.account.ethAddress
      ) {
        return this.renderBetButton(game, 'Bet');
      } else {
        return this.renderJoinButton(game, 'Join');
      }
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

  renderLastCreatedGame(game) {
    const createdGame = JSON.parse(localStorage.getItem('last')); // this.state.createdGameName
    if (createdGame) {
      if (
        createdGame === game.name &&
        game.owner === this.props.account.ethAddress
      ) {
        return (
          <BellContainer>
            <GameIcon icon={'bell'} />
            <BellText>Last</BellText>
          </BellContainer>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  render() {
    return (
      <div>
        <div>
          {this.state.receivedGame ? (
            <Redirect
              to={`/games/${
                this.state.receivedGame.id
              }`}
            />
          ) : null}
        </div>
        <div>
          <Header
            account={this.props.account}
            addresses={this.props.addresses}
            updateUserAccount={async selectedAddress => {
              this.props.updateUserAccount(selectedAddress);
            }}
            provider={this.props.provider}
            games={this.props.games}
          />
          <MetaMaskLogo />
          <ParentContainer>
            <Container>
              <h1>List of available Games</h1>
              <GamesContainer>
                {this.props.gamesLoading ? (
                  <SpinnerContainer>
                    <Spinner width={60} height={60} />
                  </SpinnerContainer>
                ) : null}
                <Table>
                  <tbody>
                    <tr>
                      <th />
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
                    {this.props.games.map(game => (
                      <tr key={game.id}>
                        <td style={{width: 8}}>
                          {this.renderLastCreatedGame(game)}
                        </td>
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
        </div>
      </div>
    );
  }
}

export default JoinGame;
